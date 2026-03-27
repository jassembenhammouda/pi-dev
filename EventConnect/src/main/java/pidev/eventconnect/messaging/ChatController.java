package pidev.eventconnect.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final CloudinaryService cloudinaryService;

    @MessageMapping("/chat")
    public void sendMessage(@Payload MessageDto messageDto) {
        Message savedMessage = chatService.saveMessage(
                Long.parseLong(messageDto.getChatId()),
                messageDto
        );

        messagingTemplate.convertAndSend(
                "/topic/messages/" + messageDto.getReceiverId(),
                savedMessage
        );

        messagingTemplate.convertAndSend(
                "/topic/messages/" + messageDto.getSenderId(),
                savedMessage
        );
    }

    @GetMapping("/user/{userId}")
    public List<Chat> getUserChats(@PathVariable String userId) {
        return chatService.getUserChats(userId);
    }

    @GetMapping("/{chatId}/messages")
    public List<Message> getChatMessages(@PathVariable Long chatId) {
        return chatService.getChatMessages(chatId);
    }

    @PostMapping("/create")
    public Chat createChat(@RequestParam String senderId, @RequestParam String recipientId) {
        return chatService.getOrCreateChat(senderId, recipientId);
    }

    @PutMapping("/messages/{messageId}/read")
    public void markAsRead(@PathVariable Long messageId) {
        chatService.markMessageAsRead(messageId);
    }

    @PostMapping("/upload-media")
    public ResponseEntity<Map<String, String>> uploadMedia(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String mediaUrl = cloudinaryService.uploadFile(file);

        Map<String, String> response = Map.of("mediaFilePath", mediaUrl);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/contact-admin")
    public ResponseEntity<Message> contactAdmin(@RequestBody MessageDto dto) {
        return ResponseEntity.ok(chatService.sendMessageToAdmin(dto));
    }
}