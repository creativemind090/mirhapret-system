import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerAddress } from '../../entities';
import { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(CustomerAddress)
    private addressRepository: Repository<CustomerAddress>,
  ) {}

  async getAddresses(userId: string) {
    const addresses = await this.addressRepository.find({
      where: { user_id: userId },
      order: { is_default_shipping: 'DESC', created_at: 'DESC' },
    });

    return addresses;
  }

  async getAddressById(userId: string, addressId: string) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user_id: userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    // If this is default, unset other defaults
    if (createAddressDto.is_default) {
      await this.addressRepository.update(
        { user_id: userId },
        { is_default_shipping: false, is_default_billing: false },
      );
    }

    const address = this.addressRepository.create({
      user_id: userId,
      full_name: 'Customer Name',
      phone_number: '1234567890',
      street_address: createAddressDto.street_address,
      city: createAddressDto.city,
      province: createAddressDto.province,
      postal_code: createAddressDto.postal_code,
      country: createAddressDto.country,
      type: createAddressDto.address_type || 'both',
      is_default_shipping: createAddressDto.is_default || false,
      is_default_billing: createAddressDto.is_default || false,
    });

    const saved = await this.addressRepository.save(address);
    return saved;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    const address = await this.getAddressById(userId, addressId);

    if (updateAddressDto.is_default === true) {
      await this.addressRepository.update(
        { user_id: userId },
        { is_default_shipping: false, is_default_billing: false },
      );
    }

    if (updateAddressDto.street_address) address.street_address = updateAddressDto.street_address;
    if (updateAddressDto.city) address.city = updateAddressDto.city;
    if (updateAddressDto.province) address.province = updateAddressDto.province;
    if (updateAddressDto.postal_code) address.postal_code = updateAddressDto.postal_code;
    if (updateAddressDto.country) address.country = updateAddressDto.country;
    if (updateAddressDto.is_default !== undefined) {
      address.is_default_shipping = updateAddressDto.is_default;
      address.is_default_billing = updateAddressDto.is_default;
    }

    const updated = await this.addressRepository.save(address);
    return updated;
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.getAddressById(userId, addressId);

    if (address.is_default_shipping || address.is_default_billing) {
      const otherAddress = await this.addressRepository.findOne({
        where: { user_id: userId },
        order: { created_at: 'DESC' },
      });

      if (otherAddress && otherAddress.id !== addressId) {
        otherAddress.is_default_shipping = address.is_default_shipping;
        otherAddress.is_default_billing = address.is_default_billing;
        await this.addressRepository.save(otherAddress);
      }
    }

    await this.addressRepository.delete(addressId);
    return { message: 'Address deleted' };
  }

  async getDefaultAddress(userId: string) {
    const address = await this.addressRepository.findOne({
      where: { user_id: userId },
      order: { is_default_shipping: 'DESC', created_at: 'DESC' },
    });

    return address || null;
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await this.getAddressById(userId, addressId);

    await this.addressRepository.update(
      { user_id: userId },
      { is_default_shipping: false, is_default_billing: false },
    );

    address.is_default_shipping = true;
    address.is_default_billing = true;
    const updated = await this.addressRepository.save(address);

    return updated;
  }
}
