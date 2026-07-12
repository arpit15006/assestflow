import { Server } from 'socket.io';

let io: Server | null = null;

export const socketService = {
  init: (server: Server) => {
    io = server;
  },
  emitToUser: (userId: string, event: string, data: any) => {
    if (io) io.to(`user:${userId}`).emit(event, data);
  },
  emitToAll: (event: string, data: any) => {
    if (io) io.emit(event, data);
  },
};
