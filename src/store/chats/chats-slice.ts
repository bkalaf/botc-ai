// src/store/chats/chats-slice.ts
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

export interface ChatLogEntry {
    message: string;
    timestamp: number;
    who: string;
}

export type ChatRoomType = 'private' | 'public';

export interface ChatRoom {
    id: string;
    type: ChatRoomType;
    assignedTo?: number;
    isOpen: boolean;
    participants: number[];
    conversationId: string | null;
}

export interface ChatsState {
    rooms: ChatRoom[];
    conversations: Record<string, ChatLogEntry[]>;
    storytellerId: number | null;
    activeConversationId: string | null;
}

const initialState: ChatsState = {
    rooms: [],
    conversations: {},
    storytellerId: null,
    activeConversationId: null
};

const ensureUniqueParticipants = (participants: number[]) => Array.from(new Set(participants));

const createConversation = (state: ChatsState, entries: ChatLogEntry[] = []) => {
    const conversationId = nanoid();
    state.conversations[conversationId] = entries;
    return conversationId;
};

const ensureRoomConversation = (state: ChatsState, room: ChatRoom) => {
    if (!room.conversationId) {
        room.conversationId = createConversation(state);
    }
};

const buildPrivateRoomId = (playerId: number) => `private-room-${playerId}`;

export const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        createST: (state, action: PayloadAction<number>) => {
            state.storytellerId = action.payload;
        },
        createSTChambers: (state, action: PayloadAction<number[]>) => {
            const playerIds = action.payload;
            const existingRooms = new Map(
                state.rooms
                    .filter((room) => room.type === 'private' && room.assignedTo != null)
                    .map((room) => [room.assignedTo as number, room])
            );

            for (const playerId of playerIds) {
                const existing = existingRooms.get(playerId);
                if (existing) {
                    continue;
                }

                const room: ChatRoom = {
                    id: buildPrivateRoomId(playerId),
                    type: 'private',
                    assignedTo: playerId,
                    isOpen: false,
                    participants: [],
                    conversationId: null
                };

                state.rooms.push(room);
            }
        },
        openPrivateRoomFor: (state, action: PayloadAction<number>) => {
            const playerId = action.payload;
            let room = state.rooms.find(
                (candidate) => candidate.type === 'private' && candidate.assignedTo === playerId
            );

            if (!room) {
                room = {
                    id: buildPrivateRoomId(playerId),
                    type: 'private',
                    assignedTo: playerId,
                    isOpen: false,
                    participants: [],
                    conversationId: null
                };
                state.rooms.push(room);
            }

            const participants = [playerId];
            if (state.storytellerId != null) {
                participants.push(state.storytellerId);
            }

            room.isOpen = true;
            room.participants = ensureUniqueParticipants(participants);
            ensureRoomConversation(state, room);
        },
        closePrivateRoom: (state, action: PayloadAction<number>) => {
            const playerId = action.payload;
            const room = state.rooms.find(
                (candidate) => candidate.type === 'private' && candidate.assignedTo === playerId
            );

            if (!room) {
                return;
            }

            room.isOpen = false;
            room.participants = [];
        },
        openPublicRoomFor: (state, action: PayloadAction<{ roomId?: string; participants?: number[] }>) => {
            const { roomId, participants = [] } = action.payload;
            const resolvedId = roomId ?? nanoid();
            let room = state.rooms.find((candidate) => candidate.id === resolvedId);

            if (!room) {
                room = {
                    id: resolvedId,
                    type: 'public',
                    isOpen: true,
                    participants: ensureUniqueParticipants(participants),
                    conversationId: null
                };
                state.rooms.push(room);
            } else {
                room.type = 'public';
                room.isOpen = true;
                room.participants = ensureUniqueParticipants([...room.participants, ...participants]);
            }

            ensureRoomConversation(state, room);
        },
        closePublicRoom: (state, action: PayloadAction<string>) => {
            const roomId = action.payload;
            const room = state.rooms.find((candidate) => candidate.id === roomId);

            if (!room) {
                return;
            }

            room.isOpen = false;
            room.participants = [];
        },
        inviteParticipantsToRoom: (state, action: PayloadAction<{ roomId: string; participants: number[] }>) => {
            const { roomId, participants } = action.payload;
            const room = state.rooms.find((candidate) => candidate.id === roomId);

            if (!room) {
                return;
            }

            room.participants = ensureUniqueParticipants([...room.participants, ...participants]);
        },
        registerConversation: (state, action: PayloadAction<{ roomId: string; entries?: ChatLogEntry[] }>) => {
            const { roomId, entries } = action.payload;
            const room = state.rooms.find((candidate) => candidate.id === roomId);

            if (!room) {
                return;
            }

            room.conversationId = createConversation(state, entries ?? []);
        },
        getConversationFromRoom: (state, action: PayloadAction<string>) => {
            const roomId = action.payload;
            const room = state.rooms.find((candidate) => candidate.id === roomId);
            state.activeConversationId = room?.conversationId ?? null;
        },
        addChatLogEntry: {
            reducer: (state, action: PayloadAction<{ conversationId: string; entry: ChatLogEntry }>) => {
                const { conversationId, entry } = action.payload;
                const existing = state.conversations[conversationId];
                if (!existing) {
                    state.conversations[conversationId] = [entry];
                    return;
                }

                existing.push(entry);
            },
            prepare: (payload: { conversationId: string; message: string; who: string }) => ({
                payload: {
                    conversationId: payload.conversationId,
                    entry: {
                        message: payload.message,
                        who: payload.who,
                        timestamp: Date.now()
                    }
                }
            })
        }
    },
    selectors: {
        roomsOccupied: (state) => state.rooms.filter((room) => room.isOpen),
        roomsEmpty: (state) => state.rooms.filter((room) => !room.isOpen),
        getRoomByID: (state, roomId: string) => state.rooms.find((room) => room.id === roomId) ?? null
    }
});

export const {
    createST,
    createSTChambers,
    openPrivateRoomFor,
    closePrivateRoom,
    openPublicRoomFor,
    closePublicRoom,
    inviteParticipantsToRoom,
    registerConversation,
    getConversationFromRoom,
    addChatLogEntry
} = chatsSlice.actions;

export const { roomsOccupied, roomsEmpty, getRoomByID } = chatsSlice.selectors;
