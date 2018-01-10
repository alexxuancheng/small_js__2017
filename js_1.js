// entering the virtual bar code into the form,the background color change to light grey
function change_bg(x){
	x.style.background='lightgray';
}

// this function applies to version 4
function get_info(){
	var x =document.getElementById('virtual_code').value;
	// get the version number v
	var v=x.slice(0,1);  
	 //get the ibna number i
	var i=x.slice(1,5)+" "+x.slice(5,9)+" "+x.slice(9,13)+" "+x.slice(13,17); 
	// get the total amount of payment t
	var t=function(){ 
			x1= x.slice(17,23)+"."+x.slice(23,26);
			x2=x1.replace(/\b(0+)/gi,"");
			if (x2.length>=7){
				x3=x2.slice(0,-7);
				x4=x2.slice(-7,-1);
				x2=x3+','+x4
			}
			return x2;
			}()  
	//get reference r
	var r=function(){ 
			x1= x.slice(28,48).replace(/\b(0+)/gi,"")
			x2=x1.split('');
			l=x2.length
			for (var i=l-6;i>=0;i-=5){
				x2[i]+=' ';
			}
			x2=x2.join('');
			return x2;
			}()  
	//get due_date d
	var d=function(){  
		x1=x.slice(48,50);
		x2=x.slice(50,52);
		x3=x.slice(52,54);
		x4=x1+'.'+x2+'.'+'20'+x3;
		return x4;
		}() 
	document.getElementById('ibna').innerHTML="Payee's IBAN: "+i;
	document.getElementById('amount').innerHTML="Amount to be paid: "+t;
	document.getElementById('reference').innerHTML="Payment reference: "+r;
	document.getElementById('due_date').innerHTML="Due date: "+d;

	// use the JsBarcode library to generate Code128, character set C
	JsBarcode(".barcode", x, {
		format: "CODE128C",
		lineColor: "black",
		width: 2,
		height: 100,
		text:x,
	});
}

// toggle the button value, the barcode box show and hide
$(document).ready(function(){
	$("#btn_hide_show").click(function(){
		if($('#info').is(':visible')){
			$('#info').slideUp();
			$('#btn_hide_show').val('show');
		}else{
			$('#info').slideDown();
			$('#btn_hide_show').val('hide');
		}
	});
});


