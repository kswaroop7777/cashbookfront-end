import { Injectable } from '@angular/core';
import * as CryptoJs from 'crypto-js'
import { globalProperties } from '../shared/globalProperties';

@Injectable({
  providedIn: 'root'
})
export class Encryption {
  private _secretKey = globalProperties.secret_key
  constructor() { }

  encrypt(data: string): string{
  return   CryptoJs.AES.encrypt(data, this._secretKey).toString()
  }

  decrypt(ciphertext: string ): string{
    const bytes = CryptoJs.AES.decrypt(ciphertext, this._secretKey)
   return  bytes.toString(CryptoJs.enc.Utf8)
  }

}