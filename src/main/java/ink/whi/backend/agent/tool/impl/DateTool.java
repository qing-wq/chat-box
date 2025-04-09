package ink.whi.backend.agent.tool.impl;

import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.model.chat.request.json.JsonObjectSchema;
import dev.langchain4j.service.tool.ToolExecutor;
import ink.whi.backend.agent.tool.Tool;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;

import static dev.langchain4j.agent.tool.JsonSchemaProperty.description;
import static dev.langchain4j.agent.tool.JsonSchemaProperty.type;

/**
 * 日期工具
 * 提供日期相关的处理功能
 */
@Slf4j
@Component
public class DateTool implements Tool {

    private static final String DATE_FORMAT = "yyyy-MM-dd";
    private static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    @Override
    public String getName() {
        return "date_tool";
    }

    public Map<ToolSpecification, ToolExecutor> getToolDefinition() {
        ToolSpecification toolSpecification = ToolSpecification.builder()
                .name(getName())
                .description("获取当前日期")
                .parameters(JsonObjectSchema.builder()
                        .addStringProperty("params", "命令，例如：current_date可以获取yyyy-MM-dd格式的当前日期")
                        .required("params")
                        .build())
                .build();

        // 业务逻辑 ToolExecutor
        ToolExecutor toolExecutor = (toolExecutionRequest, memoryId) -> {
            String arguments1 = toolExecutionRequest.arguments();
            System.out.println("data_tools arguments: " + arguments1);
//            return execute(arguments1);
            return getCurrentDate();
        };
        return Map.of(toolSpecification, toolExecutor);
    }

    @Override
    public String execute(String params) {
        try {
            // 参数格式：命令:参数
            // 例如：current_date、format:yyyy/MM/dd、days_between:2023-01-01,2023-12-31
            String[] parts = params.split(":", 2);
            String command = parts[0].trim().toLowerCase();

            return switch (command) {
                case "current_date" -> getCurrentDate();
                case "current_datetime" -> getCurrentDateTime();
                case "format" -> {
                    if (parts.length < 2) {
                        yield "错误：缺少格式参数";
                    }
                    yield formatCurrentDate(parts[1]);
                }
                case "days_between" -> {
                    if (parts.length < 2) {
                        yield "错误：缺少日期参数";
                    }
                    String[] dates = parts[1].split(",");
                    if (dates.length != 2) {
                        yield "错误：需要两个日期参数，以逗号分隔";
                    }
                    yield calculateDaysBetween(dates[0], dates[1]);
                }
                case "weekday" -> {
                    if (parts.length < 2) {
                        yield getCurrentWeekday();
                    } else {
                        yield getWeekday(parts[1]);
                    }
                }
                case "next_workday" -> getNextWorkday();
                case "weekdays_in_month" -> {
                    if (parts.length < 2) {
                        yield getWeekdaysInMonth(LocalDate.now());
                    } else {
                        yield getWeekdaysInMonth(LocalDate.parse(parts[1]));
                    }
                }
                default -> "未知命令: " + command;
            };
        } catch (Exception e) {
            log.error("执行日期工具时出错", e);
            return "日期处理错误：" + e.getMessage();
        }
    }

    /**
     * 获取当前日期
     */
    private String getCurrentDate() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern(DATE_FORMAT));
    }

    /**
     * 获取当前日期和时间
     */
    private String getCurrentDateTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(DATETIME_FORMAT));
    }

    /**
     * 格式化当前日期
     */
    private String formatCurrentDate(String format) {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(format));
    }

    /**
     * 计算两个日期之间的天数
     */
    private String calculateDaysBetween(String date1Str, String date2Str) {
        LocalDate date1 = LocalDate.parse(date1Str.trim());
        LocalDate date2 = LocalDate.parse(date2Str.trim());
        long days = Math.abs(ChronoUnit.DAYS.between(date1, date2));
        return String.valueOf(days);
    }

    /**
     * 获取当前日期的星期
     */
    private String getCurrentWeekday() {
        return getChineseWeekday(LocalDate.now().getDayOfWeek());
    }

    /**
     * 获取指定日期的星期
     */
    private String getWeekday(String dateStr) {
        LocalDate date = LocalDate.parse(dateStr.trim());
        return getChineseWeekday(date.getDayOfWeek());
    }

    /**
     * 获取下一个工作日
     */
    private String getNextWorkday() {
        LocalDate today = LocalDate.now();
        LocalDate nextDay = today.plusDays(1);

        // 如果是周末，调整到下周一
        if (nextDay.getDayOfWeek() == DayOfWeek.SATURDAY) {
            nextDay = nextDay.plusDays(2);
        } else if (nextDay.getDayOfWeek() == DayOfWeek.SUNDAY) {
            nextDay = nextDay.plusDays(1);
        }

        return nextDay.format(DateTimeFormatter.ofPattern(DATE_FORMAT));
    }

    /**
     * 获取指定月份的工作日数量
     */
    private String getWeekdaysInMonth(LocalDate date) {
        LocalDate firstDayOfMonth = date.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate lastDayOfMonth = date.with(TemporalAdjusters.lastDayOfMonth());

        int workdays = 0;
        LocalDate current = firstDayOfMonth;

        while (!current.isAfter(lastDayOfMonth)) {
            if (current.getDayOfWeek() != DayOfWeek.SATURDAY && current.getDayOfWeek() != DayOfWeek.SUNDAY) {
                workdays++;
            }
            current = current.plusDays(1);
        }

        return String.valueOf(workdays);
    }

    /**
     * 获取中文星期名称
     */
    private String getChineseWeekday(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> "星期一";
            case TUESDAY -> "星期二";
            case WEDNESDAY -> "星期三";
            case THURSDAY -> "星期四";
            case FRIDAY -> "星期五";
            case SATURDAY -> "星期六";
            case SUNDAY -> "星期日";
        };
    }
}
