var http=require('http');
var server=http.createServer();
var fs=require('fs');
var cheerio=require('cheerio');

var download=require('./download');

var url='http://grd.bit.edu.cn/';

server.on('request',function(req,res){

	var toShow="";
	//读前半段
	fs.readFile('./w1.html','utf-8',function(err,data){
		if(err)throw err;
		toShow+=data;
		//爬网站
		download.download(http,url,function(data){
				
			$=cheerio.load(data);
			
			$('div .title').addClass('pull-right');
			$('div .title h4').text('');
			$('ul li a').each(function(){
						$(this).attr('href','http://grd.bit.edu.cn/'+$(this).attr('href'));
			});
			toShow+=$('.tong').html();
			//读后半段
			fs.readFile('./w2.html','utf-8',function(err,data){
				if(err)throw err;
				toShow+=data;	
				res.writeHead(200,{'Content-Type':'text/html'});
				res.end(toShow);
			});
					
		});		
		
	});
});


server.listen(process.env.PORT||3000, function(){
  console.log('listening on *:3000');
});
