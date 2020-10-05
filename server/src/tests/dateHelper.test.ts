import {validateAndParseQueryDate} from '../helpers/dateHelpers';
import * as errors from '../constants/errors';
import moment from 'moment';

describe('Testing the dateHelper function',() => {
    
    test('Test nonsence string', () => {
        expect(() => validateAndParseQueryDate("potato")).toThrow(errors.invalidDateFormat);
    });
    
    test('Test invalid date string', () => {
        expect(() => validateAndParseQueryDate("50-1-2020")).toThrow(errors.invalidDateFormat);
    });

    test('Test valid date', () => {
        expect(
            validateAndParseQueryDate("12-12-2020").toString()
            ).toEqual(moment("12-12-2020", "DD-MM-YYYY").toString());
    });

});
