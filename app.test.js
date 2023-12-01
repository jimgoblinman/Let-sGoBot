const axios = require('axios');
const { main, fetchQuestionAndHandle, waitForUserResponse, fetchQuestion, letsGo, settings } = require('./index');

jest.mock('axios');

describe('Trivia Bot Tests', () => {
  let phone_no_id, from, msg, out_msg;

  beforeEach(() => {
    phone_no_id = 'test_phone_no_id';
    from = 'test_from';
    msg = 'test_msg';
    out_msg = 'test_out_msg';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('main function with "start" message', async () => {
    axios.mockResolvedValue({ data: { results: [{ question: 'Test Question', incorrect_answers: [], correct_answer: 'Test Correct Answer' }] } });
    await main(phone_no_id, from, 'start');
    expect(axios).toHaveBeenCalled();
  });

  test('main function with "help" message', async () => {
    const sendWhatsAppMessageMock = jest.spyOn(global, 'sendWhatsAppMessage');
    await main(phone_no_id, from, 'help');
    expect(sendWhatsAppMessageMock).toHaveBeenCalledWith(phone_no_id, from, expect.any(String));
  });


  test('waitForUserResponse function with valid input', async () => {
    const sendWhatsAppMessageMock = jest.spyOn(global, 'sendWhatsAppMessage');
    await waitForUserResponse(phone_no_id, from, ['Option 1', 'Option 2', 'Option 3', 'Option 4'], 'Option 2');
    expect(sendWhatsAppMessageMock).toHaveBeenCalledWith(phone_no_id, from, expect.stringContaining('correct'));
  });


  test('settings function', async () => {
    const sendWhatsAppMessageMock = jest.spyOn(global, 'sendWhatsAppMessage');
    axios.mockResolvedValue({ data: { results: [{ question: 'Test Question', incorrect_answers: [], correct_answer: 'Test Correct Answer' }] } });
    
    await settings(phone_no_id, from, out_msg);

    expect(sendWhatsAppMessageMock).toHaveBeenCalledTimes(3);
    expect(axios).toHaveBeenCalled();
  });

});