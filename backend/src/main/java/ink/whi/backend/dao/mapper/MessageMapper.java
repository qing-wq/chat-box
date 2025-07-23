package ink.whi.backend.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import ink.whi.backend.dao.entity.Message;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * 消息Mapper接口
 * 
 * @author: qing
 * @Date: 2025/3/2
 */
@Mapper
@Repository
public interface MessageMapper extends BaseMapper<Message> {
}
