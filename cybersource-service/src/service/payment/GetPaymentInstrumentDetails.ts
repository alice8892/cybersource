import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { PaymentType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Retrieves payment instrument details based on the payment instrument ID.
 * @param {string} paymentInstrumentId - The payment instrument ID.
 * @param {PaymentType} payment - The payment object.
 * @returns {Promise<any>} - A promise resolving to payment instrument data.
 */
const getPaymentInstrumentDetails = async (paymentInstrumentId: string, payment: PaymentType): Promise<any> => {
  const opts = '';
  const instrumentData = {
    httpCode: 0,
    cardFieldGroup: null as any,
  };
  let paymentId = payment?.id || '';
  try {
    if (paymentInstrumentId && payment) {
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_PAYMENT_INSTRUMENT_DETAILS, null, payment, null);
      const apiClient = new restApi.ApiClient();
      const paymentInstrumentApiInstance = configObject && new restApi.PaymentInstrumentApi(configObject, apiClient);
      return await new Promise<any>((resolve, reject) => {
        if (paymentInstrumentApiInstance) {
          paymentInstrumentApiInstance.getPaymentInstrument(paymentInstrumentId, opts, function (error: any, data: any, response: any) {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYMENT_INSTRUMENT_DETAILS, Constants.LOG_INFO, 'PaymentId : ' + paymentId, 'Payment Instrument Details Response = ' + JSON.stringify(response));
            if (data) {
              instrumentData.httpCode = response[Constants.STRING_RESPONSE_STATUS];
              // Extract card details from the payment instrument response
              if (data.card) {
                let suffix = '';
                let prefix = '';

                // Extract last 4 digits from embedded instrument identifier
                if (data._embedded?.instrumentIdentifier?.card?.number) {
                  const cardNumber = data._embedded.instrumentIdentifier.card.number;
                  // Extract last 4 digits from format like "545454XXXXXX5454"
                  const parts = cardNumber.split('XXXXXX');
                  if (parts.length === 2) {
                    prefix = parts[0];
                    suffix = parts[1];
                  }
                }

                instrumentData.cardFieldGroup = {
                  type: data.card.type,
                  suffix: suffix,
                  expirationMonth: data.card.expirationMonth,
                  expirationYear: data.card.expirationYear,
                  prefix: prefix
                };
              }
              resolve(instrumentData);
            } else if (error) {
              instrumentData.httpCode = error.status;
              reject(instrumentData);
            } else {
              reject(instrumentData);
            }
          });
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYMENT_INSTRUMENT_DETAILS, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        }
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYMENT_INSTRUMENT_DETAILS, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_INVALID_INPUT);
      return instrumentData;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_PAYMENT_INSTRUMENT_DETAILS, '', exception, paymentId, 'PaymentId : ', '');
    return instrumentData;
  }
};

export default { getPaymentInstrumentDetails };
