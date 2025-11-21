import { io, Socket } from 'socket.io-client';

type Callback = (data: any) => void;

const listeners: { bidPlaced?: Callback[]; playerSold?: Callback[] } = {};

class WS {
  socket: Socket | null = null;
  connect(token?: string) {
    // socket server root (not /api)
    this.socket = io(process.env.SOCKET_URL || 'http://localhost:3000', { auth: { token } });
  }
  subscribeToAuctionBids(auctionId: string, cb: (bid: any) => void) {
    this.socket?.on(`auction:${auctionId}:bid`, cb);
  }
  placeBidRest(token: string, payload: any) {
    return fetch((process.env.API_URL || 'http://localhost:3000') + '/api/bids/place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }).then(r => r.json());
  }
}

export const wsService = new WS();
export default wsService;