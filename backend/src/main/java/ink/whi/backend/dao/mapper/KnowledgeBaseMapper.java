package ink.whi.backend.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import ink.whi.backend.dao.entity.KnowledgeBase;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * @author: qing
 * @Date: 2025/7/27
 */
@Mapper
@Repository
public interface KnowledgeBaseMapper extends BaseMapper<KnowledgeBase> {
}