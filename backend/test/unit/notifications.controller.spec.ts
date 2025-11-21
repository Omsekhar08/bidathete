import { NotificationsController } from '../../../src/modules/notifications/notifications.controller';

describe('NotificationsController', () => {
  const mockNotificationsService = {
    send: jest.fn().mockResolvedValue({ _id: 'n1', title: 'Hi' }),
    listForUser: jest.fn().mockResolvedValue([{ _id: 'n1', title: 'Hi' }]),
  };

  const controller = new NotificationsController(mockNotificationsService as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send notification and return data', async () => {
    const payload = { userId: 'u1', title: 'Test', body: 'Hello' };
    const res = await controller.send(payload);
    expect(mockNotificationsService.send).toHaveBeenCalledWith(payload);
    expect(res).toEqual({ success: true, data: { _id: 'n1', title: 'Hi' } });
  });

  it('should list notifications for current user', async () => {
    const req: any = { user: { id: 'u1' } };
    const res = await controller.list(req);
    expect(mockNotificationsService.listForUser).toHaveBeenCalledWith('u1');
    expect(res).toEqual({ success: true, data: [{ _id: 'n1', title: 'Hi' }] });
  });
});