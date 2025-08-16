package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import ink.whi.backend.common.enums.ProcessTypeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: qing
 * @Date: 2025/6/18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("knowledge_base")
public class KnowledgeBase extends BaseEntity {

    /**
     * 标题
     */
    private String title;

    /**
     * 描述
     */
    private String remark;

    private Boolean isPublic;

    private Integer ownerId;

    /**
     * 嵌入模型id
     */
    private Long embeddingModelId;

    /**
     * 问答模型
     */
    private Integer qaModelId;

    // =================数据处理设置==================

    /**
     * 处理方式
     */
    private ProcessTypeEnum processType;

    /**
     * 分块大小(100-3000)
     */
    private Integer blockSize;

    /**
     * 文档切割时重叠数量(按token来计)
     */
    private Integer maxOverlap;

    /**
     * 问答提示词（可选）
     */
    private String qaPrompt;


    // ==================召回设置==================

    /**
     * 文档召回最大数量
     */
    private Integer retrieveMaxResults;

    /**
     * 文档召回最小分数
     */
    private Double retrieveMinScore;
}
