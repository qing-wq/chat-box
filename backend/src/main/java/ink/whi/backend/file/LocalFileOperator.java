package ink.whi.backend.file;


import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.document.parser.TextDocumentParser;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import dev.langchain4j.data.document.parser.apache.poi.ApachePoiDocumentParser;
import ink.whi.backend.dao.entity.BaseFile;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@Slf4j
public class LocalFileOperator {

    public static final String[] POI_DOC_TYPES = {"doc", "docx", "ppt", "pptx", "xls", "xlsx"};

    public static Document loadDocument(String filePath, String ext) {
        try {
            Document result = null;
            if (ext.equalsIgnoreCase("txt")) {
                result = FileSystemDocumentLoader.loadDocument(filePath, new TextDocumentParser());
            } else if (ext.equalsIgnoreCase("pdf")) {
                result = FileSystemDocumentLoader.loadDocument(filePath, new ApachePdfBoxDocumentParser());
            } else if (ArrayUtils.contains(POI_DOC_TYPES, ext)) {
                result = FileSystemDocumentLoader.loadDocument(filePath, new ApachePoiDocumentParser());
            }
            return result;
        } catch (Exception e) {
            log.error("load document error: {}", e.getMessage(), e);
            throw e;
        }
    }
}
