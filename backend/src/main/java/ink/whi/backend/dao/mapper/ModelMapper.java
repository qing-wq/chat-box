package ink.whi.backend.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import ink.whi.backend.dao.entity.Model;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * @author: qing
 * @Date: 2025/7/8
 */
@Mapper
@Repository
public interface ModelMapper extends BaseMapper<Model> {
}
