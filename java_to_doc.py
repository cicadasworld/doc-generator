#-*- coding: utf-8 -*-
# convert javadoc to doc
# hujin@gtgis.cn

from bs4 import BeautifulSoup
import re
import sys
import os
import os.path
from zipfile import ZipFile
from datetime import datetime
from argparse import ArgumentParser


document_template = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 wp14">
    <w:body>
        {class_tag}
        <w:p w14:paraId="75EFBD8B" w14:textId="77777777" w:rsidR="00790258" w:rsidRPr="0017455A" w:rsidRDefault="00790258" w:rsidP="00E854AE">
            <w:pPr>
                <w:rPr>
                    <w:rFonts w:hint="eastAsia" /></w:rPr>
            </w:pPr>
            <w:bookmarkStart w:id="1" w:name="_GoBack" />
            <w:bookmarkEnd w:id="1" /></w:p>
    </w:body>
</w:document>
'''


class_template = '''<w:p w14:paraId="6F63D6F4" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00A9162F">
            <w:pPr>
                <w:pStyle w:val="6" />
                <w:spacing w:line="319" w:lineRule="auto" />
                <w:jc w:val="center" />
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
            </w:pPr>
            <w:r w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:t>表</w:t>
            </w:r>
            <w:r w:rsidR="00AE3348" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:fldChar w:fldCharType="begin" /></w:r>
            <w:r w:rsidR="00AE3348" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:instrText xml:space="preserve"> STYLEREF 1 \s </w:instrText>
            </w:r>
            <w:r w:rsidR="00AE3348" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:fldChar w:fldCharType="separate" /></w:r>
            <w:r w:rsidR="006C13F2" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:noProof/>
                    <w:color w:val="auto" /></w:rPr>
                <w:t>4</w:t>
            </w:r>
            <w:r w:rsidR="00AE3348" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:fldChar w:fldCharType="end" /></w:r>
            <w:r w:rsidR="00AE3348" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:noBreakHyphen/></w:r>
            <w:r w:rsidR="00AE3348" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:fldChar w:fldCharType="begin" /></w:r>
            <w:r w:rsidR="00AE3348" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:instrText xml:space="preserve"> SEQ </w:instrText>
            </w:r>
            <w:r w:rsidR="00AE3348" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:instrText>表</w:instrText>
            </w:r>
            <w:r w:rsidR="00AE3348" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:instrText xml:space="preserve"> \* ARABIC \s 1 </w:instrText>
            </w:r>
            <w:r w:rsidR="00AE3348" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:fldChar w:fldCharType="separate" /></w:r>
            <w:r w:rsidR="006C13F2" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:noProof/>
                    <w:color w:val="auto" /></w:rPr>
                <w:t>1</w:t>
            </w:r>
            <w:r w:rsidR="00AE3348" w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:fldChar w:fldCharType="end" /></w:r>
            <w:r w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:t>{class_name}</w:t>
            </w:r>
            <w:r w:rsidRPr="0017455A">
                <w:rPr>
                    <w:rStyle w:val="af7" />
                    <w:b w:val="0" />
                    <w:bCs w:val="0" />
                    <w:iCs/>
                    <w:color w:val="auto" /></w:rPr>
                <w:t>类的组成一览表</w:t>
            </w:r>
        </w:p>
        <w:tbl>
            <w:tblPr>
                <w:tblW w:w="14175" w:type="dxa" />
                <w:tblBorders>
                    <w:top w:val="single" w:sz="12" w:space="0" w:color="auto" />
                    <w:left w:val="single" w:sz="12" w:space="0" w:color="auto" />
                    <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto" />
                    <w:right w:val="single" w:sz="12" w:space="0" w:color="auto" />
                    <w:insideH w:val="single" w:sz="4" w:space="0" w:color="auto" />
                    <w:insideV w:val="single" w:sz="4" w:space="0" w:color="auto" /></w:tblBorders>
                <w:tblLayout w:type="fixed" />
                <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1" /></w:tblPr>
            <w:tblGrid>
                <w:gridCol w:w="709" />
                <w:gridCol w:w="696" />
                <w:gridCol w:w="438" />
                <w:gridCol w:w="3544" />
                <w:gridCol w:w="2551" />
                <w:gridCol w:w="1276" />
                <w:gridCol w:w="509" />
                <w:gridCol w:w="625" />
                <w:gridCol w:w="2093" />
                <w:gridCol w:w="1734" /></w:tblGrid>
            <w:tr w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w14:paraId="31AB7B8E" w14:textId="77777777" w:rsidTr="002932B0">
                <w:trPr>
                    <w:tblHeader/></w:trPr>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="1405" w:type="dxa" />
                        <w:gridSpan w:val="2" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="12" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="643A4E17" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="both" />
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:bookmarkStart w:id="0" w:name="_Hlk467577981" />
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>类名</w:t>
                        </w:r>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>/</w:t>
                        </w:r>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>标识</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="6533" w:type="dxa" />
                        <w:gridSpan w:val="3" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="12" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="2BD2C783" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="both" />
                            <w:rPr>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>{class_name}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="1785" w:type="dxa" />
                        <w:gridSpan w:val="2" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="12" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="503CA96E" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>父类</w:t>
                        </w:r>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>/</w:t>
                        </w:r>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>标识</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="4452" w:type="dxa" />
                        <w:gridSpan w:val="3" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="12" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="423CCDAF" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00A97021" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="both" />
                            <w:rPr>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>{parent_name}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
            </w:tr>
            <w:bookmarkEnd w:id="0" />
            <w:tr w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w14:paraId="21854C0D" w14:textId="77777777" w:rsidTr="002932B0">
                <w:trPr>
                    <w:tblHeader/></w:trPr>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="709" w:type="dxa" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="4" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="1AAFCD48" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>说明</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="13466" w:type="dxa" />
                        <w:gridSpan w:val="9" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="4" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="6562FCB3" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="both" />
                            <w:rPr>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>{description}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
            </w:tr>
            <w:tr w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w14:paraId="0C75FD31" w14:textId="77777777" w:rsidTr="002932B0">
                <w:trPr>
                    <w:tblHeader/></w:trPr>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="14175" w:type="dxa" />
                        <w:gridSpan w:val="10" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="4" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="11C34D37" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>方法</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
            </w:tr>
            <w:tr w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w14:paraId="3A6B599D" w14:textId="77777777" w:rsidTr="009A151D">
                <w:trPr>
                    <w:tblHeader/></w:trPr>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="709" w:type="dxa" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="4" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="257EFBD9" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>序号</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="1134" w:type="dxa" />
                        <w:gridSpan w:val="2" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="4" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="13906C68" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>函数名</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="3544" w:type="dxa" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="4" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="269B8A94" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>原形</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="3827" w:type="dxa" />
                        <w:gridSpan w:val="2" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="4" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="38201D78" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>参数</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="1134" w:type="dxa" />
                        <w:gridSpan w:val="2" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="4" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="431745EE" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>访问</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="2093" w:type="dxa" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="4" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="6EE2A448" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>返值</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="1734" w:type="dxa" />
                        <w:tcBorders>
                            <w:top w:val="single" w:sz="4" w:space="0" w:color="auto" />
                            <w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto" /></w:tcBorders>
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" />
                        <w:hideMark/></w:tcPr>
                    <w:p w14:paraId="07C562C8" w14:textId="77777777" w:rsidR="00FF1DE7" w:rsidRPr="0017455A" w:rsidRDefault="00FF1DE7" w:rsidP="00FF1DE7">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r w:rsidRPr="0017455A">
                            <w:rPr>
                                <w:b/>
                                <w:bCs/>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>功能说明</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
            </w:tr>
            {method_tag}
        </w:tbl>
'''

method_template = '''<w:tr w:rsidR="00A97021" w:rsidRPr="0017455A" w14:paraId="3EBCBBDC" w14:textId="77777777" w:rsidTr="00E854AE">
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="709" w:type="dxa" />
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" /></w:tcPr>
                    <w:p w14:paraId="5835F1F8" w14:textId="77777777" w:rsidR="00A97021" w:rsidRPr="0017455A" w:rsidRDefault="00A97021" w:rsidP="00A97021">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:color w:val="000000" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:color w:val="000000" /></w:rPr>
                            <w:t>{index}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="1134" w:type="dxa" />
                        <w:gridSpan w:val="2" />
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" /></w:tcPr>
                    <w:p w14:paraId="28909308" w14:textId="034C81B7" w:rsidR="00A97021" w:rsidRPr="0017455A" w:rsidRDefault="00E656E3" w:rsidP="00A97021">
                        <w:pPr>
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:rFonts w:hint="eastAsia" />
                                <w:color w:val="000000" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:rFonts w:hint="eastAsia" />
                                <w:color w:val="000000" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>{method_name}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="3544" w:type="dxa" />
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" /></w:tcPr>
                    <w:p w14:paraId="475B6077" w14:textId="29190965" w:rsidR="00A97021" w:rsidRPr="0017455A" w:rsidRDefault="00E656E3" w:rsidP="00323044">
                        <w:pPr>
                            <w:spacing w:before="0" />
                            <w:rPr>
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:rFonts w:hint="eastAsia" />
                                <w:kern w:val="0" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>{prototype}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="3827" w:type="dxa" />
                        <w:gridSpan w:val="2" />
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" /></w:tcPr>
                    <w:p w14:paraId="17908DF3" w14:textId="408A3F36" w:rsidR="00A97021" w:rsidRPr="0017455A" w:rsidRDefault="00E656E3" w:rsidP="00A97021">
                        <w:pPr>
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:rFonts w:hint="eastAsia" />
                                <w:color w:val="000000" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:rFonts w:hint="eastAsia" />
                                <w:color w:val="000000" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>{parameter}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="1134" w:type="dxa" />
                        <w:gridSpan w:val="2" />
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" /></w:tcPr>
                    <w:p w14:paraId="1FA25927" w14:textId="12A7CB18" w:rsidR="00A97021" w:rsidRPr="0017455A" w:rsidRDefault="00E656E3" w:rsidP="00A97021">
                        <w:pPr>
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:rFonts w:hint="eastAsia" />
                                <w:color w:val="000000" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:rFonts w:hint="eastAsia" />
                                <w:color w:val="000000" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>{access}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="2093" w:type="dxa" />
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" /></w:tcPr>
                    <w:p w14:paraId="3242F7A6" w14:textId="4A270E57" w:rsidR="00A97021" w:rsidRPr="0017455A" w:rsidRDefault="00E656E3" w:rsidP="00A97021">
                        <w:pPr>
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:color w:val="000000" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:rFonts w:hint="eastAsia" />
                                <w:color w:val="000000" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>{return_type}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="1734" w:type="dxa" />
                        <w:shd w:val="clear" w:color="auto" w:fill="auto" />
                        <w:vAlign w:val="center" /></w:tcPr>
                    <w:p w14:paraId="4E2363E9" w14:textId="575E0967" w:rsidR="00A97021" w:rsidRPr="0017455A" w:rsidRDefault="00E656E3" w:rsidP="00A97021">
                        <w:pPr>
                            <w:jc w:val="center" />
                            <w:rPr>
                                <w:color w:val="000000" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                        </w:pPr>
                        <w:r>
                            <w:rPr>
                                <w:rFonts w:hint="eastAsia" />
                                <w:color w:val="000000" />
                                <w:sz w:val="21" />
                                <w:szCs w:val="21" /></w:rPr>
                            <w:t>{comment}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
            </w:tr>
'''


class Clazz(object):
    """docstring for Clazz"""
    def __init__(self, class_name, parent_name, description, method_list):
        self.class_name = class_name
        self.parent_name = parent_name
        self.description = description
        self.method_list = method_list
        

class Method(object):
    """docstring for Method"""
    def __init__(self, method_name, prototype, parameter, access, return_type, comment):
        self.method_name = method_name
        self.prototype = prototype
        self.parameter = parameter
        self.access = access
        self.return_type = return_type
        self.comment = comment


def filter_file(root, file, html_files):
    f = os.path.join(root, file)
    if 'class-use' not in f and f.split('\\')[-1][0].isupper(): #过滤'class-use'包，开头字母大写
        html_files.append(f)       


def list_html_files(javadoc_dir):
    html_files = []
    for root, _, files in os.walk(javadoc_dir):
        for file in files:
            if file.endswith('.html'):
                filter_file(root, file, html_files)
    return html_files


def replace_angels(text):
    return text.replace('<', '&lt;').replace('>', '&gt;')


def generate_temp_name():
    return datetime.now().strftime('%Y%m%d%H%M%S')


def fetch_method_parameters(split_str):
    start = split_str.find('(')
    end = split_str.find(')')
    parameter = split_str[start+1:end]
    parameter = replace_angels(parameter)
    return parameter


def parse_method_details_block(block, method_list):
    method_name = block.find('h4').text

    prototype = block.find('pre').text
    prototype = replace_angels(prototype)

    comment_block = block.select('.block')
    comment = comment_block[0].text if len(comment_block) !=0 else ''
    comment = replace_angels(comment)

    ret = re.search('public|protected', prototype) # search for access-type
    if ret is None: #access is default
        access = ''
        lst = prototype.split()
        return_type = lst[0]
        method_name = lst[1].split('(')[0]
        split_str = prototype[prototype.index(method_name):]
        parameter = fetch_method_parameters(split_str)
    else:
        access = ret.group(0)
        lst = prototype.split()
        if len(lst) <= 2:return # 过滤构造器
        s = lst[lst.index(access) + 1]
        if s == 'static': # 静态方法
            return_type = lst[lst.index(access) + 2]
            method_name = lst[lst.index(access) + 3].split('(')[0]
            split_str = prototype[prototype.index(method_name):]
            split_str = prototype[prototype.index(method_name):]
            parameter = fetch_method_parameters(split_str)
        else:
            return_type = lst[lst.index(access) + 1]
            method_name = lst[lst.index(access) + 2].split('(')[0]
            split_str = prototype[prototype.index(method_name):]
            split_str = prototype[prototype.index(method_name):]
            parameter = fetch_method_parameters(split_str)

    method = Method(method_name, prototype, parameter, access, return_type, comment)
    method_list.append(method)


def parse(html_file, classes):
    with open(html_file, 'r', encoding='gbk', errors='ignore') as f:
        xml = f.read()
        soup = BeautifulSoup(xml, 'lxml')
        ih = soup.select('.inheritance')
        if len(ih) == 0:return
        class_name = ih[-1].text
        class_name = replace_angels(class_name)

        parent_name = ih[-2].text.split()[0]
        parent_name = replace_angels(parent_name)

        description_block = soup.select('.description')[0].select('.block')
        description = description_block[0].text if len(description_block) != 0 else ''
        description = replace_angels(description)

        details = soup.select('.details')
        if len(details) == 0:return
        constructor_method_details = details[0].find('ul').find('li').find_all('ul', recursive=False)
        if len(constructor_method_details) == 2:
            method_details = constructor_method_details[1]
        elif (len(constructor_method_details)) == 3:
            method_details = constructor_method_details[2]
        else:
            method_details = constructor_method_details[0]

        blockList = method_details.find('li').find_all('ul')
        method_list = [];
        for block in blockList:
            parse_method_details_block(block, method_list)

        clazz = Clazz(class_name, parent_name, description, method_list)
        classes.append(clazz)


def generate_method_tag(clazz):
    method_tag = ''
    methods = clazz.method_list
    for i in range(len(methods)):
        method_tag += method_template.format(index=i+1,
                            method_name=methods[i].method_name,
                            prototype=methods[i].prototype,
                            parameter=methods[i].parameter,
                            access=methods[i].access,
                            return_type=methods[i].return_type,
                            comment=methods[i].comment)
    return method_tag


def generate_class_tag(classes):
    class_tag = ''
    for clazz in classes:
        method_tag = generate_method_tag(clazz)        
        class_tag += class_template.format(class_name=clazz.class_name,
                                parent_name=clazz.parent_name,
                                description=clazz.description,
                                method_tag=method_tag)
    return class_tag


def get_arguments():
    parser = ArgumentParser()
    parser.add_argument('javadoc_dir', help='A javadoc folder')
    arguments = parser.parse_args()
    return arguments


def main():
    # 解析命令行参数
    args = get_arguments()
    html_files = list_html_files(args.javadoc_dir)

    # 解析html
    classes = []
    for html_file in html_files:
        parse(html_file, classes)

    # 生成xml标签
    class_tag = generate_class_tag(classes)
    doc = document_template.format(class_tag=class_tag)

    base = os.path.abspath('artifact_template')

    # 生成xml文件
    xml = os.path.join(base, 'word\document.xml')
    with open(xml, 'w', encoding='utf-8') as f:
        f.write(doc)

    temp_name = generate_temp_name()
    zip_name = str(temp_name) + '.zip'
    doc_name = str(temp_name) + '.docx'
    # 压缩成zip文件
    with ZipFile(zip_name, 'w') as archive:
        for root, dirs, files in os.walk(base):
            for file in files:
                f = os.path.join(root, file)
                e = f[len(base) + 1:]
                archive.write(f, e)

    # 重命名成word文档
    os.rename(zip_name, doc_name)
    

if __name__ == '__main__':
    main()