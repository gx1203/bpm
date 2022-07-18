<template>
  <div id="article_content" class="article_content" data-find="_1">
    <p>Cron表达式时间字段</p>
    <p>Quartz使用类似于Linux下的Cron表达式定义时间规则，Cron表达式由6或7个由空格分隔的时间字段组成，如表1所示：</p>
    <p />
    <table border="1" cellpadding="1" cellspacing="1">
      <tbody>
        <tr class="textblack">
          <td valign="top" width="54">
            <p>位置</p>
          </td>
          <td valign="top" width="82">
            <p>时间域名</p>
          </td>
          <td width="133">
            <p>允许值</p>
          </td>
          <td width="290">
            <p>允许的特殊字符</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="54">
            <p>1</p>
          </td>
          <td valign="top" width="82">
            <p>秒</p>
          </td>
          <td valign="top" width="133">
            <p>0-59</p>
          </td>
          <td valign="top" width="290">
            <p>, - * /</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="54">
            <p>2</p>
          </td>
          <td valign="top" width="82">
            <p>分钟</p>
          </td>
          <td valign="top" width="133">
            <p>0-59</p>
          </td>
          <td valign="top" width="290">
            <p>, - * /</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="54">
            <p>3</p>
          </td>
          <td valign="top" width="82">
            <p>小时</p>
          </td>
          <td valign="top" width="133">
            <p>0-23</p>
          </td>
          <td valign="top" width="290">
            <p>, - * /</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="54">
            <p>4</p>
          </td>
          <td valign="top" width="82">
            <p>日期</p>
          </td>
          <td valign="top" width="133">
            <p>1-31</p>
          </td>
          <td valign="top" width="290">
            <p>, - * ? / L W C</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="54">
            <p>5</p>
          </td>
          <td valign="top" width="82">
            <p>月份</p>
          </td>
          <td valign="top" width="133">
            <p>1-12</p>
          </td>
          <td valign="top" width="290">
            <p>, - * /</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="54">
            <p>6</p>
          </td>
          <td valign="top" width="82">
            <p>星期</p>
          </td>
          <td valign="top" width="133">
            <p>1-7</p>
          </td>
          <td valign="top" width="290">
            <p>, - * ? / L C #</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="54">
            <p>7</p>
          </td>
          <td valign="top" width="82">
            <p>年(可选)</p>
          </td>
          <td valign="top" width="133">
            <p>空值1970-2099</p>
          </td>
          <td valign="top" width="290">
            <p>, - * /</p>
          </td>
        </tr>
      </tbody>
    </table>
    <br>
    <p />
    <p />
    <p>Cron表达式的时间字段除允许设置数值外，还可使用一些特殊的字符，提供列表、范围、通配符等功能，细说如下：</p>
    <p>●星号(*)：可用在所有字段中，表示对应时间域的每一个时刻，例如，*在分钟字段时，表示“每分钟”；</p>
    <p>●问号（?）：该字符只在日期和星期字段中使用，它通常指定为“无意义的值”，相当于点位符；</p>
    <p>●减号(-)：表达一个范围，如在小时字段中使用“10-12”，则表示从10到12点，即10,11,12；</p>
    <p>●逗号(,)：表达一个列表值，如在星期字段中使用“MON,WED,FRI”，则表示星期一，星期三和星期五；</p>
    <p>●斜杠(/)：x/y表达一个等步长序列，x为起始值，y为增量步长值。如在分钟字段中使用0/15，则表示为0,15,30和45秒，而5/15在分钟字段中表示5,20,35,50，你也可以使用*/y，它等同于0/y；</p>
    <p>●L：该字符只在日期和星期字段中使用，代表“Last”的意思，但它在两个字段中意思不同。L在日期字段中，表示这个月份的最后一天，如一月的31号，非闰年二月的28号；如果L用在星期中，则表示星期六，等同于7。但是，如果L出现在星期字段里，而且在前面有一个数值X，则表示“这个月的最后X天”，例如，6L表示该月的最后星期五；</p>
    <p>●W：该字符只能出现在日期字段里，是对前导日期的修饰，表示离该日期最近的工作日。例如15W表示离该月15号最近的工作日，如果该月15号是星期六，则匹配14号星期五；如果15日是星期日，则匹配16号星期一；如果15号是星期二，那结果就是15号星期二。但必须注意关联的匹配日期不能够跨月，如你指定1W，如果1号是星期六，结果匹配的是3号星期一，而非上个月最后的那天。W字符串只能指定单一日期，而不能指定日期范围；</p>
    <p>●LW组合：在日期字段可以组合使用LW，它的意思是当月的最后一个工作日；</p>
    <p>●井号(#)：该字符只能在星期字段中使用，表示当月某个工作日。如6#3表示当月的第三个星期五(6表示星期五，#3表示当前的第三个)，而4#5表示当月的第五个星期三，假设当月没有第五个星期三，忽略不触发；</p>
    <p>
      ●
      C：该字符只在日期和星期字段中使用，代表“Calendar”的意思。它的意思是计划所关联的日期，如果日期没有被关联，则相当于日历中所有日期。例如5C在日期字段中就相当于日历5日以后的第一天。1C在星期字段中相当于星期日后的第一天。
    </p>
    <p>Cron表达式对特殊字符的大小写不敏感，对代表星期的缩写英文大小写也不敏感。</p>
    <p>下面给出一些完整的Cron表示式的实例：</p>
    <p />
    <table border="1" cellpadding="1" cellspacing="1">
      <tbody>
        <tr class="textblack">
          <td width="235">
            <p>表示式</p>
          </td>
          <td width="324">
            <p>说明</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 0 12 * * ? "</p>
          </td>
          <td valign="top" width="324">
            <p>每天12点运行</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 15 10 ? * *"</p>
          </td>
          <td valign="top" width="324">
            <p>每天10:15运行</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 15 10 * * ?"</p>
          </td>
          <td valign="top" width="324">
            <p>每天10:15运行</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 15 10 * * ? *"</p>
          </td>
          <td valign="top" width="324">
            <p>每天10:15运行</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 15 10 * * ? 2008"</p>
          </td>
          <td valign="top" width="324">
            <p>在2008年的每天10：15运行</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 * 14 * * ?"</p>
          </td>
          <td valign="top" width="324">
            <p>每天14点到15点之间每分钟运行一次，开始于14:00，结束于14:59。</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 0/5 14 * * ?"</p>
          </td>
          <td valign="top" width="324">
            <p>每天14点到15点每5分钟运行一次，开始于14:00，结束于14:55。</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 0/5 14,18 * * ?"</p>
          </td>
          <td valign="top" width="324">
            <p>每天14点到15点每5分钟运行一次，此外每天18点到19点每5钟也运行一次。</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 0-5 14 * * ?"</p>
          </td>
          <td valign="top" width="324">
            <p>每天14:00点到14:05，每分钟运行一次。</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 10,44 14 ? 3 WED"</p>
          </td>
          <td valign="top" width="324">
            <p>3月每周三的14:10分到14:44，每分钟运行一次。</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 15 10 ? * MON-FRI"</p>
          </td>
          <td valign="top" width="324">
            <p>每周一，二，三，四，五的10:15分运行。</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 15 10 15 * ?"</p>
          </td>
          <td valign="top" width="324">
            <p>每月15日10:15分运行。</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 15 10 L * ?"</p>
          </td>
          <td valign="top" width="324">
            <p>每月最后一天10:15分运行。</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 15 10 ? * 6L"</p>
          </td>
          <td valign="top" width="324">
            <p>每月最后一个星期五10:15分运行。</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 15 10 ? * 6L 2007-2009"</p>
          </td>
          <td valign="top" width="324">
            <p>在2007,2008,2009年每个月的最后一个星期五的10:15分运行。</p>
          </td>
        </tr>
        <tr class="textblack">
          <td valign="top" width="235">
            <p>"0 15 10 ? * 6#3"</p>
          </td>
          <td valign="top" width="324">
            <p>每月第三个星期五的10:15分运行。</p>
          </td>
        </tr>
      </tbody>
    </table>
    <p />
    <p>
      <br>
    </p>
    <p>
      <br>
    </p>
  </div>
</template>
<style lang="scss" scoped>
#article_content{
    font-size: 16px;
    line-height: 24px;
    padding: 20px;
    p{
        margin: 10px 0;
    }
}
</style>
