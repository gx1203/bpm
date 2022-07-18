var TANGER_OCX_OBJ; //控件对象
var IsFileOpened; //标记文档是否打开
var cutomtoolbar = false; //是否已定义工具栏
var cmd; //命令类型
var axiosUrl;
var itemObj = {};
var id;
var fileName;

//初始化去打开文档
function init(cmd, isEdit, axiosUrl, name, id) {
  id = id
  if (isEdit === "false") {
    document.getElementById('saveOffice').style.display = 'none'
  } else {
    document.getElementById('saveOffice').style.display = 'inline-block'
    document.getElementById('officecontrol').style.height = 'calc(100vh - 40px)'
  }
  document.getElementById("DataToChild").innerHTML = JSON.stringify([id, name]);
  TANGER_OCX_OBJ = document.getElementById("TANGER_OCX");
  if (window.navigator.platform == "Win64") {
    TANGER_OCX_OBJ.AddDocTypePlugin(".tif", "tif.NtkoDocument", "4.0.0.2", "officecontrol/ntkooledocallx64.cab", 51, true);
    TANGER_OCX_OBJ.AddDocTypePlugin(".pdf", "PDF.NtkoDocument", "4.0.0.2", "officecontrol/ntkooledocallx64.cab", 51, true);
    TANGER_OCX_OBJ.AddDocTypePlugin(".tiff", "TIF.NtkoDocument", "4.0.0.1", "officecontrol/ntkooledocallx64.cab", 52, true);
  } else {
    TANGER_OCX_OBJ.AddDocTypePlugin(".pdf", "PDF.NtkoDocument", "4.0.0.2", "officecontrol/ntkooledocall.cab", 51, true);
    TANGER_OCX_OBJ.AddDocTypePlugin(".tif", "tif.NtkoDocument", "4.0.0.2", "officecontrol/ntkooledocall.cab", 51, true);
    TANGER_OCX_OBJ.AddDocTypePlugin(".tiff", "TIF.NtkoDocument", "4.0.0.1", "officecontrol/ntkooledocall.cab", 52, true);
  }
  TANGER_OCX_OBJ.FileNew = false
  TANGER_OCX_OBJ.Activate(false);
  TANGER_OCX_OBJ.IsShowOpeningDocUI = true;
  if (id == 'undefined') {
    // TANGER_OCX_OBJ.CreateNew("word.document");
  } else {
    ntkoBrowser.ntkoSetReturnValueToParentPage("ntkoSendDataToChildtext", "ntko");
    setTimeout(function () {
      itemObj = {
        id: id,
        name: name
      };
      TANGER_OCX_OBJ.OpenFromURL(axiosUrl + "/bpm/attachment/download/" + itemObj.id + '?attachmentType=bpm', false, "Word.document");
      if (isEdit === "false") {
        document.getElementById('saveOffice').style.display = 'none'
        SetDocReadOnly()
      } else {
        SetReviewMode(true)
        document.getElementById('saveOffice').style.display = 'inline-block'
        document.getElementById('officecontrol').style.height = 'calc(100vh - 40px)'
        UnSetReadOnly()
      }
    }, 0)
  }

}
//新建文档
function CreateNewOffice(progid) {
  TANGER_OCX_OBJ.CreateNew(progid);
}
//删除左右两端的空格
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
//从服务器磁盘目录打开文档
function OpenOfficeFromServerDir() {
  TANGER_OCX_OBJ.OpenFromURL("OpenFromServerDir.jsp?filename=test.doc", false, "word.document");
}

//从服务器项目相对路径打开文档
function OpenOfficeFromServer() {
  // TANGER_OCX_OBJ.OpenFromURL("templateFile/head.doc");
}
//从服务器项目相对目录打开PDF文档
function OpenPdfFromUrl() {
  // TANGER_OCX_OBJ.OpenFromURL("templateFile/test.pdf");
}
//从URL打开文档
function OpenOfficeFromURL() {
  // TANGER_OCX_OBJ.OpenFromURL("http://localhost:1986/newdemo/templateFile/newWordTemplate.doc");
}
//从本地打开文档
function OpenLocalFile() {
  TANGER_OCX_OBJ.ShowDialog(1);
}
//保存文档到服务器磁盘目录
function SaveOfficeToServerDir() {
  var _name = ''
  if (fileName && fileName != "" && fileName != "undefined") {
    var names = fileName.split("\\");
    _name = names[names.length - 1];
  }else{
	TANGER_OCX_OBJ.ShowTipMessage("提示", trim("请打开要保存的附件！！"));
	return
  }
  if (_name.indexOf('/attachment/download/') === -1 && _name != itemObj.id) {
    itemObj.name = _name
  }
  var token = 'token:' + localStorage.getItem('token')
  TANGER_OCX_OBJ.AddHTTPHeader(token)
  var a = TANGER_OCX_OBJ.SaveToURL(
    axiosUrl + "/attach/upload", //提交到的url地址
    "file", //文件域的id，类似<input type=file name=upLoadFile 中的name
    "", //与控件一起提交的参数如："p1=a&p2=b&p3=c"
    itemObj.name, //上传文件的名称，类似<input type=file 的value
    itemObj.id, //与控件一起提交的表单id，也可以是form的序列号，这里应该是0.
    true);
  if (browser == "IE") {
    if (a) {
      document.getElementById("DataToChild").innerHTML = JSON.stringify([JSON.parse(a).id, JSON.parse(a).newName]);
      TANGER_OCX_OBJ.ShowTipMessage("提示", trim("保存成功"));
    } else {
      TANGER_OCX_OBJ.ShowTipMessage("提示", trim("保存失败"));
    }
  }
}


function SaveOfficeToServerDir5() {
  var filename = "mydoc.ofd";
  var a = TANGER_OCX_OBJ.SaveAsOFDToURL(
    axiosUrl + "/attach/upload", //提交到的url地址
    "upLoadFile", //文件域的id，类似<input type=file name=upLoadFile 中的name
    "p1=a&p2=b&p3=c", //与控件一起提交的参数如："p1=a&p2=b&p3=c"
    filename, //上传文件的名称，类似<input type=file 的value
    0, //与控件一起提交的表单id，也可以是form的序列号，这里应该是0.
    true);
  if (browser == "IE") {
    TANGER_OCX_OBJ.ShowTipMessage("提示", trim(a));
  }
}

function SaveOfficeToServerDir4() {
  var filename = "mydoc.pdf";
  TANGER_OCX_OBJ.IsUseOfficeConvertDocToPDF = true;
  var a = TANGER_OCX_OBJ.PublishAsHTMLToURL(
    axiosUrl + "/attach/upload", //提交到的url地址
    "upLoadFile", //文件域的id，类似<input type=file name=upLoadFile 中的name
    "p1=a&p2=b&p3=c", //与控件一起提交的参数如："p1=a&p2=b&p3=c"
    filename, //上传文件的名称，类似<input type=file 的value
    0, //与控件一起提交的表单id，也可以是form的序列号，这里应该是0.
    true);
  if (browser == "IE") {
    TANGER_OCX_OBJ.ShowTipMessage("提示", trim(a));
  }
}

function SaveOfficeToServerDir3() {
  var filename = "mydoc.html";
  var a = TANGER_OCX_OBJ.PublishAsHTMLToURL(
    axiosUrl + "/attach/upload", //提交到的url地址
    "upLoadFile", //文件域的id，类似<input type=file name=upLoadFile 中的name
    "p1=a&p2=b&p3=c", //与控件一起提交的参数如："p1=a&p2=b&p3=c"
    filename, //上传文件的名称，类似<input type=file 的value
    0, //与控件一起提交的表单id，也可以是form的序列号，这里应该是0.
    true);
  if (browser == "IE") {
    TANGER_OCX_OBJ.ShowTipMessage("提示", trim(a));
  }
}
//保存文档到服务器磁盘目录
function SaveOfficeToServerDir2() {
  var filename = "mydoc.doc";
  var a = TANGER_OCX_OBJ.SaveAsOtherFormatToURL(
    5,
    axiosUrl + "/attach/upload", //提交到的url地址
    "upLoadFile", //文件域的id，类似<input type=file name=upLoadFile 中的name
    "p1=a&p2=b&p3=c", //与控件一起提交的参数如："p1=a&p2=b&p3=c"
    filename, //上传文件的名称，类似<input type=file 的value
    0, //与控件一起提交的表单id，也可以是form的序列号，这里应该是0.
    true);
  if (browser == "IE") {
    TANGER_OCX_OBJ.ShowTipMessage("提示", trim(a));
  }
}
//保存文档到数据库
function SaveOfficeToMysql() {
  var filename = "20150408001.doc";
  var a = TANGER_OCX_OBJ.SaveToURL(
    "SaveToMysql.jsp?id=" + "0", //提交到的url地址
    "upLoadFile", //文件域的id，类似<input type=file name=upLoadFile 中的name
    "", //与控件一起提交的参数如："p1=a&p2=b&p3=c"
    "", //上传文件的名称，类似<input type=file 的value
    0 //与控件一起提交的表单id，也可以是form的序列号，这里应该是0.
  );
  if (browser == "IE") {
    TANGER_OCX_OBJ.ShowTipMessage("提示", trim(a));
  }
}
//保存文档为PDF到服务器
function SaveAsPdfToUrl() {
  if (!TANGER_OCX_OBJ.IsPDFCreatorInstalled()) {
    TANGER_OCX_OBJ.ShowTipMessage("提示", "请先安装PDFCreator！");
    return;
  }
  try {
    var filename = "2.pdf";
    TANGER_OCX_OBJ.PublishAsPDFToURL(axiosUrl + "/attach/upload?filename=" + filename, "upLoadFile");

  } catch (e) {
    alert(e);
  }
}
//保存文档为PDF到服务器
function SaveAsPdfToUrl2() {
  try {
    var filename = "2.pdf";
    TANGER_OCX_OBJ.IsUseOfficeConvertDocToPDF = true;
    TANGER_OCX_OBJ.PublishAsPDFToURL(axiosUrl + "/attach/upload?filename=" + filename, "upLoadFile");

  } catch (e) {
    alert(e);
  }
}
//文档禁止编辑
function SetDocReadOnly() {
  try {
    if (TANGER_OCX_OBJ.DocType == 1) {
      TANGER_OCX_OBJ.ActiveDocument.Protect(1, true, "password");
    } else if (TANGER_OCX_OBJ.DocType == 2) {
      TANGER_OCX_OBJ.ActiveDocument.Protect("password");
      for (var i = 1; i <= TANGER_OCX_OBJ.ActiveDocument.Sheets.Count; i++) {
        TANGER_OCX_OBJ.ActiveDocument.Sheets(i).Protect("password", true, true, true, true);
        //TANGER_OCX_OBJ.ActiveDocument.Sheets(i).EnableSelection =-4142;
      }
    } else {
      TANGER_OCX_OBJ.ShowTipMessage("提示", "不允许设置只读.");

    }
  } catch (err) {
    alert("错误" + err.description);
  }
}
//文档允许编辑
function UnSetReadOnly() {
  if (TANGER_OCX_OBJ.DocType == 1) {
    TANGER_OCX_OBJ.ActiveDocument.UnProtect("password");
  } else if (TANGER_OCX_OBJ.DocType == 2) {
    for (var i = 1; i <= TANGER_OCX_OBJ.ActiveDocument.Sheets.Count; i++) {
      TANGER_OCX_OBJ.ActiveDocument.Sheets(i).Unprotect("password");
    }

    TANGER_OCX_OBJ.ActiveDocument.application.ActiveWorkbook.Unprotect("password");
  } else {
    TANGER_OCX_OBJ.ShowTipMessage("提示", "不允许设置允许编辑.");
  }
}
//是否显示工具栏等
function IsShowToolBar() {
  TANGER_OCX_OBJ.Toolbars = !TANGER_OCX_OBJ.Toolbars;
  TANGER_OCX_OBJ.Titlebar = !TANGER_OCX_OBJ.Titlebar;
  TANGER_OCX_OBJ.Statusbar = !TANGER_OCX_OBJ.Statusbar;
  TANGER_OCX_OBJ.Menubar = !TANGER_OCX_OBJ.Menubar;
  TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.DocumentMap = !TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.DocumentMap; //隐藏导航窗格
  TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.ActivePane.DisplayRulers = !TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.ActivePane.DisplayRulers; //隐藏标尺
  TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.DocumentMap = false; //隐藏左侧导航格
}
//菜单栏项灰色
function MenubarShowGray() {
  TANGER_OCX_OBJ.FileOpen = !TANGER_OCX_OBJ.FileOpen;
  TANGER_OCX_OBJ.FileClose = !TANGER_OCX_OBJ.FileClose;
  TANGER_OCX_OBJ.FilePageSetup = !TANGER_OCX_OBJ.FilePageSetup;
  TANGER_OCX_OBJ.FilePrint = !TANGER_OCX_OBJ.FilePrint;
  TANGER_OCX_OBJ.FilePrintPreview = !TANGER_OCX_OBJ.FilePrintPreview;
}
//自定义工具栏功能
function ShowCutomToolBar(bool) {
  if (bool) {
    if (!cutomtoolbar) {
      TANGER_OCX_OBJ.CustomToolBar = true;
      TANGER_OCX_OBJ.AddCustomToolButton("打印", 9); //添加自定义工具栏按钮
      TANGER_OCX_OBJ.AddCustomToolButton("打印预览", 10); //添加自定义工具栏按钮
      TANGER_OCX_OBJ.AddCustomToolButton("关闭预览", 10); //添加自定义工具栏按钮
      TANGER_OCX_OBJ.AddCustomToolButton("关闭文档", -1); //添加自定义工具栏按钮
      TANGER_OCX_OBJ.AddCustomToolButton("功能区", -1); //添加自定义工具栏按钮
      TANGER_OCX_OBJ.AddCustomToolButton("阅读模式", -1); //添加自定义工具栏按钮
      TANGER_OCX_OBJ.AddCustomToolButton("菜单栏项灰色", -1); //添加自定义工具栏按钮
      TANGER_OCX_OBJ.AddCustomToolButton("禁止编辑", -1); //添加自定义工具栏按钮
      TANGER_OCX_OBJ.AddCustomToolButton("允许编辑", -1); //添加自定义工具栏按钮
      TANGER_OCX_OBJ.AddCustomToolButton("接受痕迹-清稿", -1); //添加自定义工具栏按钮
      TANGER_OCX_OBJ.AddCustomToolButton("拒绝痕迹-清稿", -1); //添加自定义工具栏按钮
      TANGER_OCX_OBJ.AddCustomToolButton("模板套红", -1); //添加自定义工具栏按钮
      cutomtoolbar = true;
    }
  } else {
    TANGER_OCX_OBJ.CustomToolBar = false;
  }
}
//痕迹保留
function SetReviewMode(flag) {
  TANGER_OCX_OBJ.ActiveDocument.TrackRevisions = flag; //是否启动痕迹保留
  TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = flag; //是否显示痕迹
  TANGER_OCX_OBJ.EnterRevisionMode(flag, "password");
}
//接受或者取消所有修订
function TANGER_OCX_AllRevisions(flag) {
  if (flag) {
    TANGER_OCX_OBJ.ActiveDocument.AcceptAllRevisions(); //接受所有的痕迹修订
  } else {
    TANGER_OCX_OBJ.ActiveDocument.Application.WordBasic.RejectAllChangesInDoc(); //拒绝所有痕迹修订
  }
}
//文件头套红
function insertRedHeadFromUrl(headFileURL) {
  TANGER_OCX_OBJ.AddTemplateFromURL(headFileURL);
}
//获取全文内容
function getContent() {
  //定义变量，存放内容
  var content = "";
  //得到信息的段落数
  var curSel = TANGER_OCX_OBJ.ActiveDocument.Application.Selection;
  curSel.WholeStory(); //选中全文
  content = curSel.Range.Text;
  return content;
}
//保护文档部分修改    书签范围可以编辑
function protectPartDoc() {
  var marks = TANGER_OCX_OBJ.ActiveDocument.Bookmarks; //获取所有的书签
  for (var i = 1; i <= marks.Count; i++) {
    if (marks(i).Name != "biaoti") {
      TANGER_OCX_OBJ.ActiveDocument.Bookmarks(marks(i).Name).Range.Select(); //选取书签区域保护
      TANGER_OCX_OBJ.ActiveDocument.Application.Selection.Editors.Add(-1); //增加可编辑区域
      TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.View.ShadeEditableRanges = 0;
      TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.View.ShowBookmarks = true;
    }
  }
  if (TANGER_OCX_OBJ.ActiveDocument.ProtectionType == -1) {
    TANGER_OCX_OBJ.ActiveDocument.TrackRevisions = true; //是否启动痕迹保留
    TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = true; //是否显示痕迹
    TANGER_OCX_OBJ.ActiveDocument.Protect(3, 0, "password"); //实现文档保护
  }
}

//自定义工具栏操作
function CustomToolBarCom(btnIdx) {
  if (0 == btnIdx) {
    MyPrint(true);
  }
  if (1 == btnIdx) {
    MyPrintPreview();
  }
  if (2 == btnIdx) {
    MyExitPrintPreview();
  }
  if (3 == btnIdx) {
    TANGER_OCX_OBJ.Close();
  }
  if (4 == btnIdx) {
    TANGER_OCX_OBJ.ToolBars = !TANGER_OCX_OBJ.ToolBars;
  }
  if (5 == btnIdx) {
    IsShowToolBar();
  }
  if (6 == btnIdx) {
    MenubarShowGray();
  }
  if (7 == btnIdx) {
    protectPartDoc();
  }
  if (8 == btnIdx) {
    UnSetReadOnly();
  }
  if (9 == btnIdx) {
    TANGER_OCX_AllRevisions(true);
  }
  if (10 == btnIdx) {
    TANGER_OCX_AllRevisions(false);
  }
  if (11 == btnIdx) {
    insertRedHeadFromUrl("OfficeFile/head.doc");
  }
}

//打印文档
function MyPrint(selectprint) {
  if (IsFileOpened) {
    TANGER_OCX_OBJ.PrintOut(selectprint);
  } else {
    TANGER_OCX_OBJ.ShowTipMessage("提示", "无文档打开不能执行打印！");
  }
}
//打印预览文档
function MyPrintPreview() {
  if (IsFileOpened) {
    TANGER_OCX_OBJ.PrintPreview();
  } else {
    TANGER_OCX_OBJ.ShowTipMessage("提示", "无文档打开不能执行打印预览！");
  }
}
//退出打印预览文档
function MyExitPrintPreview() {
  TANGER_OCX_OBJ.ExitPrintPreview();
}
//自定义菜单按钮
// function AddButtonOnMenu() {
// 	TANGER_OCX_OBJ.AddCustomButtonOnMenu(1, "插入文字", true, 1, 80);
// 	TANGER_OCX_OBJ.AddCustomButtonOnMenu(2, "插入文字水印", true, 2, 80);
// 	TANGER_OCX_OBJ.AddCustomButtonOnMenu(3, "插入图片水印", true, 3, 80);
// 	TANGER_OCX_OBJ.AddCustomButtonOnMenu(4, "页面转word", true, 4, 80);
// 	TANGER_OCX_OBJ.AddCustomButtonOnMenu(5, "替换测试", true, 5, 80);
// 	TANGER_OCX_OBJ.AddCustomButtonOnMenu(6, "替换测试2", true, 6, 80);
// 	TANGER_OCX_OBJ.AddCustomButtonOnMenu(7, "删除水印", true, 7, 80);
// 	TANGER_OCX_OBJ.AddCustomButtonOnMenu(8, "关闭页面", true, 8, 80);
// }
//增加自定义菜单
function MyCustomMenus() {
  // AddButtonOnMenu();
  // TANGER_OCX_OBJ.AddCustomMenu2(0, "新建(&N)");
  //增加一级菜单子菜单项目
  // TANGER_OCX_OBJ.AddCustomMenuItem2(0, 0, -1, false, "新建WORD文档", false, 4050);
  // TANGER_OCX_OBJ.AddCustomMenuItem2(0, 1, -1, false, "新建EXCEL文档", false, 4100);
  // TANGER_OCX_OBJ.AddCustomMenuItem2(0, 2, -1, false, "新建PPT文档", false, 4150);
}
//自定义菜单栏触发事件--
function CustomButtonOnMenuCmd(btnPos, btnCaption, btnCmdid) {
  if (btnCmdid == 1) {
    TANGER_OCX_OBJ.ActiveDocument.Application.Selection.TypeText("追加内容");
  } else if (btnCmdid == 2) {
    addWaterMark("复印无效");
  } else if (btnCmdid == 3) {
    addWaterMarkPic(getUrl() + "logo.png");
  } else if (btnCmdid == 4) {
    SetBookMarksValut();
  } else if (btnCmdid == 5) {
    ReplaceKeyWords();
  } else if (btnCmdid == 6) {
    ReplaceKeyWords2();
  } else if (btnCmdid == 7) {
    DelWaterPic();
  } else if (btnCmdid == 8) {
    if (TANGER_OCX_OBJ.FullScreenMode) {
      TANGER_OCX_OBJ.FullScreenMode = false;

    }
    window.opener = null;
    window.open('', '_self');
    window.close();
  }
}
//增加文字水印
function addWaterMark(text) {
  try {
    var ActiveDocument = TANGER_OCX_OBJ.ActiveDocument;
    //ActiveDocument.Sections(1).Range.Select();
    ActiveDocument.ActiveWindow.ActivePane.View.SeekView = 9; //wdSeekCurrentPageHeader
    var Selection = ActiveDocument.Application.Selection;
    for (var i = 1; i <= Selection.HeaderFooter.Shapes.Count; i++) {
      if (Selection.HeaderFooter.Shapes.Item(i).Name == "watermarkpic") {
        return;
      }
    }
    Selection.PageSetup.DifferentFirstpageHeaderFooter = -1 ? Selection.PageSetup.DifferentFirstpageHeaderFooter = false : ""; //取消首页不同
    Selection.PageSetup.OddAndEvenPagesHeaderFooter == -1 ? Selection.PageSetup.OddAndEvenPagesHeaderFooter = false : ""; //取消奇偶页不同
    Selection.HeaderFooter.Shapes.AddTextEffect(0, text, "宋体", 1, false, false, 0, 0).select();
    Selection.ShapeRange.Name = "watermarkpic";
    //Selection.HeaderFooter.Shapes(1).Select();
    //Selection.ShapeRange.TextEffect.NormalizedHeight = false;
    //Selection.ShapeRange.Name = "msoTextEffect1";
    Selection.ShapeRange.Line.Visible = false;
    Selection.ShapeRange.Fill.Visible = true;
    Selection.ShapeRange.Fill.Solid();
    Selection.ShapeRange.Fill.ForeColor.RGB = 12345;
    Selection.ShapeRange.Fill.Transparency = 0.5;
    Selection.ShapeRange.Rotation = 315;
    Selection.ShapeRange.LockAspectRatio = true;
    Selection.ShapeRange.Height = ActiveDocument.Application.CentimetersToPoints(4.13);
    Selection.ShapeRange.Width = ActiveDocument.Application.CentimetersToPoints(16.52);
    Selection.ShapeRange.WrapFormat.AllowOverlap = true;
    Selection.ShapeRange.WrapFormat.Side = 3; //wdWrapNone
    Selection.ShapeRange.WrapFormat.Type = 3;
    Selection.ShapeRange.RelativeHorizontalPosition = 0; //wdRelativeVerticalPositionMargin
    Selection.ShapeRange.RelativeVerticalPosition = 0; //wdRelativeVerticalPositionMargin
    Selection.ShapeRange.Left = -999995; //wdShapeCenter
    Selection.ShapeRange.Top = -999995; //wdShapeCenter
    ActiveDocument.ActiveWindow.ActivePane.View.SeekView = 0; //wdSeekMainDocument
  } catch (err) {
    alert("插入水印失败：" + err.description);
  }
}

function DelWaterPic() {
  try {
    var ActiveDocument = TANGER_OCX_OBJ.ActiveDocument;
    ActiveDocument.ActiveWindow.ActivePane.View.SeekView = 9; //wdSeekCurrentPageHeader
    var Selection = ActiveDocument.Application.Selection;
    Selection.HeaderFooter.Shapes.Item("watermarkpic").Select();
    Selection.Delete();
    ActiveDocument.ActiveWindow.ActivePane.View.SeekView = 0; //wdSeekMainDocument
  } catch (err) {
    alert("删除水印失败：" + err.description);
  }
}

function getUrl() {
  var pathName = window.location.href;
  var varLength = pathName.lastIndexOf("/");
  var strURL = pathName.substr(0, varLength + 1);
  return strURL;
}
//增加图片水印
function addWaterMarkPic(URL) {
  try {
    var ActiveDocument = TANGER_OCX_OBJ.ActiveDocument;
    //ActiveDocument.Sections(1).Range.Select();
    ActiveDocument.ActiveWindow.ActivePane.View.SeekView = 9; //wdSeekCurrentPageHeader
    var Selection = ActiveDocument.Application.Selection;
    Selection.HeaderFooter.Shapes.AddPicture(URL, false, true).Select();
    Selection.ShapeRange.Name = "wordwatermakepic2";
    Selection.ShapeRange.PictureFormat.Brightness = 0.8;
    Selection.ShapeRange.PictureFormat.Contrast = 0.5;
    Selection.ShapeRange.LockAspectRatio = true;
    Selection.ShapeRange.Height = ActiveDocument.Application.CentimetersToPoints(4.42);
    Selection.ShapeRange.Width = ActiveDocument.Application.CentimetersToPoints(4.92);
    Selection.ShapeRange.WrapFormat.AllowOverlap = true;
    Selection.ShapeRange.WrapFormat.Side = 3;
    Selection.ShapeRange.WrapFormat.Type = 3;
    Selection.ShapeRange.RelativeHorizontalPosition = 0;
    Selection.ShapeRange.RelativeVerticalPosition = 0;
    Selection.ShapeRange.Left = -999995; //wdShapeCenter
    Selection.ShapeRange.Top = -999995; //wdShapeCenter
    ActiveDocument.ActiveWindow.ActivePane.View.SeekView = 0; //wdSeekMainDocument
  } catch (err) {
    alert("插入水印失败：" + err.description);
  }
}

//自定义菜单触发
function CustomMenuCmd(menuPos, submenuPos, subsubmenuPos, menuCaption, menuID) {
  if (menuID == 4050) {
    CreateNewOffice("Word.Document");
  } else if (menuID == 4100) {
    CreateNewOffice("Excel.Sheet");
  } else if (menuID == 4150) {
    CreateNewOffice("PowerPoint.Show");
  } else {
    TANGER_OCX_OBJ.ShowTipMessage("提示", "第" + menuPos + "," + submenuPos + "," + subsubmenuPos + "个菜单项,menuID=" + menuID + ",菜单标题为\"" + menuCaption + "\"的命令被执行.");
  }
}
//获取文档名称
function GetFileName(filepath) {
  if (filepath != "") {
    var names = filepath.split("\\");
    return names[names.length - 1];
  }
}

function serchKeyWords(keys) {
  var sel = TANGER_OCX_OBJ.ActiveDocument.Application.Selection;
  var pagenum = TANGER_OCX_OBJ.ActiveDocument.Application.Selection.Information(3);
  sel.Find.ClearFormatting();
  with(sel.Find) {
    Text = keys;
    Replacement.Text = "";
    Forward = true;
    Wrap = 1;
    Format = false;
    MatchCase = false;
    MatchWholeWord = false;
    MatchByte = true;
    MatchAllWordForms = false;
    MatchSoundsLike = false;
    MatchAllWordForms = false;
    while (Execute()) {
      var bke = sel.Range.End;
      var bks = sel.Range.Start;
      var cen = (bke - bks) / 2 + bks;
      sel.SetRange(cen, cen);
      sel.InsertAfter(pagenum);
    }
  }
  TANGER_OCX_OBJ.ActiveDocument.Application.Selection.Homekey(6); //回到文档首页
}

function AddAttachFile() {
  TANGER_OCX_OBJ.DeleAllFileFromUploadFileAttachFileList(); //删除上次选择的文件 ，也可以不删根据流程需求
  //DeleFileFromUploadFileAttachFileList(ByVal FileName) 此方法可以删除指定的文件
  TANGER_OCX_OBJ.AddFileToUploadFileAttachFileList("attachFile[]", true, "*");
  var count = TANGER_OCX_OBJ.GetUploadFileAttachFileCount();
  var filepaths = "";
  for (var i = 1; i <= count; i++) {
    filepaths += TANGER_OCX_OBJ.GetUploadFileAttachItemFile(i) + ";";
  }

  document.getElementById("FileUploadText").value = filepaths;
}

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}

function ReplaceKeyWords() {
  TANGER_OCX_OBJ.ActiveDocument.Application.Selection.Find.Execute("行政部");
  TANGER_OCX_OBJ.ActiveDocument.Application.Selection.TypeText("祎重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司");
}

function ReplaceKeyWords2() {
  var doc = TANGER_OCX_OBJ.ActiveDocument; //TANGER_OCX_OBJ为控件对象
  doc.Application.Selection.Find.text = "行政部";
  var relpace = "重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司重庆软航科技有限公司";
  doc.Application.Selection.Find.Execute("行政部", false, false, false, false, false, true, 1, false, relpace, 2); //execute方法可参考word的api
}

function SetBookMarksValut() {
  var bookmarks = TANGER_OCX_OBJ.Activedocument.Bookmarks;
  var list = document.getElementsByTagName("input");
  var strData = "";
  for (var i = 0; i < list.length && list[i]; i++) {
    if (list[i].type == "text") {
      if (bookmarks.Exists(list[i].id)) {
        TANGER_OCX_OBJ.SetBookMarkValue(list[i].id, list[i].value);
      }
    }
  }
}
