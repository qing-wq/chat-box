package ink.whi.backend.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import ink.whi.backend.dao.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * @author: qing
 * @Date: 2025/3/21
 */
@Mapper
@Repository
public interface UserMapper extends BaseMapper<User> {
}
