package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import ink.whi.backend.common.enums.EmbeddingStatusEnum;
import ink.whi.backend.common.enums.ProcessTypeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 知识库条目实体类
 */
@Data
@TableName("knowledge_base_item")
@EqualsAndHashCode(callSuper = true)
public class KnowledgeBaseItem extends BaseEntity {

    /**
     * 所属知识库ID
     */
    private Integer kbId;

    /**
     * 源文件id
     */
    private Integer sourceId;

    /**
     * 源文件名
     */
    private String sourceName;

    /**
     * 条目标题
     */
    private String title;

    /**
     * 处理方式
     */
    private ProcessTypeEnum processType;

    /**
     * 内容摘要
     */
//    private String brief;

    /**
     * 完整内容
     */
//    private String remark;

    /**
     * 是否启动
     */
    private Boolean isEnable;

    /**
     * 向量化状态
     */
    private EmbeddingStatusEnum embeddingStatus;

    /**
     * 向量化状态变更时间
     */
    private LocalDateTime embeddingStatusChangeTime;

}
