package pidev.eventconnect.messaging;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chats")
public class Chat extends BaseAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_id", nullable = false)
    private String senderId;

    @Column(name = "recipient_id", nullable = false)
    private String recipientId;

    @OneToMany(mappedBy = "chat", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @OrderBy("createdDate DESC")
    private List<Message> messages;

    @Transient
    public long getUnreadMessages(String currentUserId) {
        if (messages == null) return 0;
        return messages.stream()
                .filter(m -> m.getReceiverId().equals(currentUserId))
                .filter(m -> m.getState() == MessageState.SENT)
                .count();
    }

    @Transient
    public String getLastMessage() {
        if (messages != null && !messages.isEmpty()) {
            Message last = messages.get(0);
            if (last.getType() != MessageType.TEXT) {
                return "Attachment";
            }
            return last.getContent();
        }
        return null;
    }

    @Transient
    public LocalDateTime getLastMessageTime() {
        if (messages != null && !messages.isEmpty()) {
            return messages.get(0).getCreatedDate();
        }
        return null;
    }
}