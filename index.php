<?php
date_default_timezone_set('Asia/Shanghai');
$dbms='mysql';     //数据库类型
$host='bdm**********.my3w.com'; //数据库主机名
$dbName='bdm**********_db';    //使用的数据库
$user='bdm**********';      //数据库连接用户名
$pass='***********';          //对应的密码
$dsn="$dbms:host=$host;dbname=$dbName";

try {
    $dbh = new PDO($dsn, $user, $pass); //初始化一个PDO对象
     $dbh->exec("set names utf8");

     // 对数据的操作方式
     $action = isset($_POST['action']) ? $_POST['action'] : $_GET['action'];

     //如果为存储数据
     if($action === 'setMes'){
        //初始化数据
     	$arr = array('username'=>$_POST['user'],'email'=>$_POST['email'],'content'=>$_POST['content'],'insert_time'=>time());
        //将数据插入数据库
		if(insert($arr,'js_mes',$dbh) == 1){
			echo 'true';
		}else{
			echo 'false';
		}
    //如果是获取数据
     }elseif($action === 'getMes'){
     	$sth = $dbh->prepare("SELECT * FROM js_mes ORDER BY id DESC");
     	$sth->execute();

     	/* 获取所有值 */
     	$result = $sth->fetchAll(PDO::FETCH_ASSOC);
        //将数据拼接为HTML格式
     	$str = '';
     	foreach($result as $v){
     		$str .= "
     			<dl>
     				<dt>{$v['username']} <span>". date('Y-m-d H:i:s',$v['insert_time']) ."</span></dt>
     				<dd>{$v['content']}</dd>
     			</dl>
     		";
     	}
     	echo $str;
     }
    $dbh = null;
} catch (PDOException $e) {
    die ("Error!: " . $e->getMessage() . "<br/>");
}

/**
 * 封装数据的插入操作
 * @param  [type] $arr  数据
 * @param  [type] $name 数据库
 * @param  [type] $dbh  PDO对象
 * @return [type]       [description]
 */
function insert($arr,$name,$dbh){
	$str = "INSERT INTO {$name} (" ;
	$str1 = '';
	foreach($arr as $k=>$v) {
	    $str .= $k . ",";
	    $str1 .= ':' . $k . ',';
	}
	$str = substr($str, 0, strlen($str)-1) . ') VALUES (';
	$str1 = substr($str1, 0, strlen($str1)-1) . ')';
	$sql = $str . $str1;
	$stmt = $dbh->prepare($sql);

	foreach($arr as $k=>$v){
		$stmt->bindParam(':'.$k, $$k);
		$$k = $v;
	}
	return $stmt->execute();
}