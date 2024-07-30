import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class UtilHelper {
    constructor() { }

    /**
     * @description
     * Function to convert the words into uppercase
     */
    public async convertToUcWords(words: string): Promise<string> {
        return words
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * @description
     * Function to create date in specified format
     */
    public createDateFromFromat(format: string) {
        return moment().format(format);
    }

    /**
     * @description
     * Function to create date in specified format
     */
    public formatDate(dateString: string, format: string) {
        const date = new Date(dateString);
        return date;
    }
}
