(function(root){
'use strict';
class Client{
 constructor(config,fetcher=fetch){this.config=config;this.fetcher=fetcher;this.session=null;this.refreshing=null;}
 get configured(){return /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(this.config.supabaseUrl)&&/^sb_publishable_/.test(this.config.publishableKey);}
 accept(s){if(!s?.access_token||!s.refresh_token||!s.user?.id)throw Error('Oturum doğrulanamadı.');this.session={access_token:s.access_token,refresh_token:s.refresh_token,user:{id:s.user.id},expires_at:s.expires_at||Date.now()/1000+(s.expires_in||3600)};return this.session;}
 async request(path,body,method='POST',auth=true){if(!this.configured)throw Error('Üyelik bağlantısı henüz hazırlanıyor. Misafir olarak oynayabilirsiniz.');if(auth&&this.session&&this.session.expires_at<Date.now()/1000+60)await this.refresh();const headers={apikey:this.config.publishableKey,'Content-Type':'application/json'};if(auth&&this.session)headers.Authorization='Bearer '+this.session.access_token;let response;try{response=await this.fetcher(this.config.supabaseUrl+path,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(15000)});}catch{throw Error('Bağlantı kurulamadı. Yerel ilerlemeniz korunuyor.');}if(!response.ok){if(response.status===429)throw Error('Çok sık deneme yapıldı. Biraz bekleyin.');if(response.status===401||response.status===400&&path.startsWith('/auth/'))throw Error('Giriş bilgilerini, e-posta doğrulamasını veya kodu kontrol edin.');throw Error('İşlem tamamlanamadı. Bağlantıyı kontrol edip yeniden deneyin.');}return response.status===204?null:response.json();}
 async refresh(){if(!this.session?.refresh_token)throw Error('Yeniden giriş yapın.');if(!this.refreshing)this.refreshing=this.request('/auth/v1/token?grant_type=refresh_token',{refresh_token:this.session.refresh_token},'POST',false).then(s=>{this.accept(s);this.onSession?.(this.session);return s;}).finally(()=>this.refreshing=null);return this.refreshing;}
 async login(email,password){const s=await this.request('/auth/v1/token?grant_type=password',{email,password},'POST',false);this.accept(s);return this.session;}
 signup(email,password,redirect){return this.request('/auth/v1/signup?redirect_to='+encodeURIComponent(redirect),{email,password},'POST',false);}
 recover(email,redirect){return this.request('/auth/v1/recover?redirect_to='+encodeURIComponent(redirect),{email},'POST',false);}
 async logout(){try{if(this.session)await this.request('/auth/v1/logout',{});}finally{this.session=null;}}
 rpc(name,args={}){return this.request('/rest/v1/rpc/'+name,args);}
}
root.VeshteAccountClient=Client;if(typeof module!=='undefined')module.exports=Client;
})(typeof window!=='undefined'?window:globalThis);
