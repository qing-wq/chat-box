package ink.whi.backend.common.dto.knowledgeBase;

import ink.whi.backend.dao.entity.KnowledgeBase;
import lombok.Data;

import java.util.List;

/**
 * @author: qing
 * @Date: 2025/7/27
 */
@Data
public class KbDetailVO {
    private KnowledgeBase knowledgeBase;

    private List<KbItemDto> itemLists;
}
