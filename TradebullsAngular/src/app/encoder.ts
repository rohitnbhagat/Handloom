import { HttpUrlEncodingCodec} from '@angular/common/http';

export class CustomHttpUrlEncodingCodec extends HttpUrlEncodingCodec{

    override encodeKey(key: string): string {
    key = super.encodeKey(key);
    return key.replace(/\+/gi,'%2B');
}
override encodeValue(value: string): string {
    value = super.encodeValue(value);
    return value.replace(/\+/gi,'%2B');
}

}