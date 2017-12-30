<?php
$dbms='mysql';     //数据库类型
$host='bdm*********.my3w.com'; //数据库主机名
$dbName='bdm*********_db';    //使用的数据库
$user='bdm*********';      //数据库连接用户名
$pass='************';          //对应的密码
$dsn="$dbms:host=$host;dbname=$dbName";

try {
    $dbh = new PDO($dsn, $user, $pass); //初始化一个PDO对象
     $dbh->exec("set names utf8");

     $action = isset($_POST['action']) ? $_POST['action'] : $_GET['action'];


     if($action === 'setMes'){
     	$arr = array('username'=>$_POST['user'],'email'=>$_POST['email'],'content'=>$_POST['content'],'insert_time'=>time());
		if(insert($arr,'js_mes',$dbh) == 1){
			echo 'true';
		}else{
			echo 'false';
		}
     }elseif($action === 'getMes'){
     	$sth = $dbh->prepare("SELECT * FROM js_mes ORDER BY id DESC");
     	$sth->execute();

     	/* 获取第一列所有值 */
     	$result = $sth->fetchAll(PDO::FETCH_ASSOC);

     	$str = '';
     	foreach($result as $v){
     		$str .= "
     			<dl>
     				<dt>{$v['username']} <span>". date('Y-m-d H:i:s',$v['insert_time']) ."</span></dt>
     				<dd>{$v['content']}</dd>
     			</dl>
     		";
     	}

     	/*<dl>
     		<dt>张焕标33</dt>
     		<dd>一杯敬明天，一杯敬过往，一杯敬自由，一杯敬死亡</dd>
     	</dl>*/
     	echo $str;
     }
    $dbh = null;
} catch (PDOException $e) {
    die ("Error!: " . $e->getMessage() . "<br/>");
}

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