import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

class WebSocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(`${WS_URL}/bids`, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinAuction(auctionId: string, teamId?: string) {
    if (this.socket) {
      this.socket.emit('joinAuction', { auctionId, teamId });
    }
  }

  leaveAuction(auctionId: string) {
    if (this.socket) {
      this.socket.emit('leaveAuction', { auctionId });
    }
  }

  placeBid(data: {
    auctionId: string;
    playerId: string;
    teamId: string;
    amount: number;
  }) {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.emit('placeBid', data, (response: any) => {
          if (response.success) {
            resolve(response.bid);
          } else {
            reject(new Error(response.error));
          }
        });
      } else {
        reject(new Error('Socket not connected'));
      }
    });
  }

  onBidPlaced(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('bidPlaced', callback);
    }
  }

  onPlayerSold(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('playerSold', callback);
    }
  }

  onBidError(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('bidError', callback);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const wsService = new WebSocketService();
export default wsService;