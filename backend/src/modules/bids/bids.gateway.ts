import { WebSocketGateway, WebSocketServer, OnGatewayConnection, ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { BidsService } from './bids.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class BidsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private bidsService: BidsService) {}

  handleConnection(client?: Socket) {
    // noop
  }

  handleDisconnect(client?: Socket) {
    // noop
  }

  @SubscribeMessage('joinAuction')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { auctionId: string; teamId?: string }) {
    // join room
    client.join(`auction:${data.auctionId}`);
    return { success: true };
  }

  @SubscribeMessage('leaveAuction')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() data: { auctionId: string }) {
    client.leave(`auction:${data.auctionId}`);
    return { success: true };
  }

  @SubscribeMessage('placeBid')
  async handlePlaceBid(@ConnectedSocket() client: Socket, @MessageBody() data: { auctionId: string; userId: string; amount: number }) {
    const bid = { id: `bid_${Date.now()}`, auctionId: data.auctionId, userId: data.userId, amount: data.amount, createdAt: new Date().toISOString() };
    try {
      await this.bidsService.create({ auctionId: bid.auctionId, userId: bid.userId, amount: bid.amount } as any);
    } catch (e) {
      // swallow
    }
    this.server.to(`auction:${data.auctionId}`).emit(`auction:${data.auctionId}:bid`, bid);
    return { success: true };
  }

  async broadcastBid(bid: any) {
    try {
      await this.bidsService.create({ auctionId: bid.auctionId, userId: bid.userId, amount: bid.amount } as any);
    } catch (e) {}
    this.server.emit(`auction:${bid.auctionId}:bid`, bid);
  }
}