import { NotificationsService } from '../../../src/modules/notifications/notifications.service';

describe('NotificationsService', () => {
  // mock model constructor (new Model(payload).save())
  const mockSave = jest.fn().mockResolvedValue({ _id: 'n1', userId: 'u1', title: 'Test' });
  const MockModel: any = jest.fn().mockImplementation((payload) => ({ save: mockSave }));

  // mock find chain
  MockModel.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([{ _id: 'n1', userId: 'u1', title: 'Test' }]),
  });

  let service: NotificationsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotificationsService(MockModel as any);
  });

  it('should create and save a notification', async () => {
    const payload = { userId: 'u1', title: 'Hello', body: 'World' };
    const res = await service.send(payload);
    expect(MockModel).toHaveBeenCalledWith(payload);
    expect(mockSave).toHaveBeenCalled();
    expect(res).toEqual({ _id: 'n1', userId: 'u1', title: 'Test' });
  });

  it('should list notifications for a user', async () => {
    const res = await service.listForUser('u1', 10);
    expect(MockModel.find).toHaveBeenCalledWith({ userId: 'u1' });
    expect(res).toEqual([{ _id: 'n1', userId: 'u1', title: 'Test' }]);
  });
});