package ink.whi.backend.controller;

import ink.whi.backend.common.converter.PlatformConverter;
import ink.whi.backend.common.dto.ResVo;
import ink.whi.backend.common.dto.platform.PlatformCreateReq;
import ink.whi.backend.common.dto.platform.PlatformDetailDTO;
import ink.whi.backend.common.dto.platform.PlatformUpdateReq;
import ink.whi.backend.dao.entity.Model;
import ink.whi.backend.dao.entity.Platform;
import ink.whi.backend.service.ModelService;
import ink.whi.backend.service.PMService;
import ink.whi.backend.service.PlatformService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 平台管理接口
 * @author: qing
 * @Date: 2025/6/27
 */
@RestController
@RequestMapping("api/platform")
@RequiredArgsConstructor
public class PlatformController {

    private final PlatformService platformService;

    private final ModelService modelService;

    /**
     * 创建平台
     * @param req 创建请求
     * @return 创建的平台ID
     */
    @PostMapping("/create")
    public ResVo<Integer> createPlatform(@RequestBody PlatformCreateReq req) {
        Integer platformId = platformService.createPlatform(req);
        return ResVo.ok(platformId);
    }

    /**
     * 获取用户所有平台列表
     * @return 平台列表
     */
    @GetMapping("/list")
    public ResVo<List<Platform>> getAllPlatforms() {
        List<Platform> platformList = platformService.getAllPlatforms();
        return ResVo.ok(platformList);
    }

    /**
     * 根据平台ID获取平台详情
     * @param platformId 平台ID
     * @return 平台详情
     */
    @GetMapping("/detail/{platformId}")
    public ResVo<PlatformDetailDTO> getPlatformById(@PathVariable Integer platformId) {
        Platform platform = platformService.getOrThrow(platformId);
        PlatformDetailDTO detail = PlatformConverter.toPlatformDetailDTO(platform);

        List<Model> models = modelService.getModelsByPlatformId(platformId);
        detail.setModelList(models);

        return ResVo.ok(detail);
    }

    /**
     * 更新平台信息
     * @param req 更新请求
     * @return 是否成功
     */
    @PostMapping("/update")
    public ResVo<String> updatePlatform(@RequestBody PlatformUpdateReq req) {
        // 只能更新key和url
        platformService.updatePlatform(req);
        return ResVo.ok("ok");
    }

    /**
     * 删除平台
     * @param platformId 平台ID
     * @return 是否成功
     */
    @GetMapping("/delete/{platformId}")
    public ResVo<String> deletePlatform(@PathVariable Integer platformId) {
        platformService.deletePlatform(platformId);
        return ResVo.ok("ok");
    }
}
