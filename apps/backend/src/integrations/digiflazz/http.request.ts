import { Inject, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import axios from 'axios';
import { PriceListResponse } from './digiflazz.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class Digiflazz {
  private apiKey: string;
  private username: string;
  private endpointCreateTransaction: string;
  private endpointGetProducts: string;

  constructor(@Inject() config: ConfigService) {
    this.apiKey = config.get('digiflazz.apiKey') as string;
    this.username = config.get('digiflazz.username') as string;
    this.endpointCreateTransaction = 'https://api.digiflazz.com/v1/transaction';
    this.endpointGetProducts = 'https://api.digiflazz.com/v1/price-list';
  }

  async CheckPrice() {
    const sign = this.generateSign('prepaid');
    const payload = this.definePayload('prepaid', sign);
    try {
      const response = await axios({
        method: 'POST',
        url: this.endpointGetProducts,
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      });
      const data = response.data as PriceListResponse;
      console.log(data);
      return data.data;
    } catch (error) {
      return null;
    }
  }

  private generateSign(cmd: string, reference?: string): string {
    if (cmd === 'prepaid') {
      return crypto.createHash('md5').update(this.apiKey).digest('hex');
    } else {
      return crypto
        .createHash('md5')
        .update(this.username + this.apiKey + reference)
        .digest('hex');
    }
  }

  private definePayload(cmd: string, sign: string) {
    return {
      cmd,
      username: this.username,
      sign: sign,
    };
  }
}
