package pidev.eventconnect.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserClient userClient;
    private final MessageRepository messageRepository;

    public List<Chat> getUserChats(String userId) {
        return chatRepository.findByUserId(userId);
    }

    public Chat getOrCreateChat(String senderId, String recipientId) {
        return chatRepository.findBySenderAndRecipient(senderId, recipientId)
                .orElseGet(() -> {
                    Chat chat = new Chat();
                    chat.setSenderId(senderId);
                    chat.setRecipientId(recipientId);
                    return chatRepository.save(chat);
                });
    }

    public String getChatName(Chat chat, String currentUserId) {
        try {
            User sender = userClient.findById(chat.getSenderId())
                    .orElseThrow(() -> new RuntimeException("Sender not found"));
            User recipient = userClient.findById(chat.getRecipientId())
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));

            if (recipient.getId().equals(currentUserId)) {
                return sender.getFirstName() + " " + sender.getLastName();
            }
            return recipient.getFirstName() + " " + recipient.getLastName();
        } catch (Exception e) {
            return chat.getSenderId().equals(currentUserId)
                    ? chat.getRecipientId()
                    : chat.getSenderId();
        }
    }

    public Message saveMessage(long chatId, MessageDto dto) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        Message message = new Message();
        message.setChat(chat);
        message.setSenderId(dto.getSenderId());
        message.setReceiverId(dto.getReceiverId());
        message.setContent(dto.getContent());
        message.setType(dto.getType());
        message.setMediaFilePath(dto.getMediaFilePath());
        message.setState(MessageState.SENT);

        return messageRepository.save(message);
    }

    public List<Message> getChatMessages(long chatId) {
        return messageRepository.findByChatIdOrderByCreatedDateDesc(chatId);
    }

    public void markMessageAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setState(MessageState.SEEN);
        messageRepository.save(message);
    }

    public Message sendMessageToAdmin(MessageDto dto) {
        User admin = userClient.findAll().stream()
                .filter(u -> "Admin".equalsIgnoreCase(u.getRole()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Aucun administrateur trouvé en base"));

        Chat chat = getOrCreateChat(dto.getSenderId(), admin.getId());

        Message message = new Message();
        message.setChat(chat);
        message.setSenderId(dto.getSenderId());
        message.setReceiverId(admin.getId());
        message.setContent(dto.getContent());
        message.setType(dto.getType());
        message.setState(MessageState.SENT);

        return messageRepository.save(message);
    }
}