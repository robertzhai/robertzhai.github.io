---
layout: post
title:  "android service-webview-http 笔记（四）"
date:   2016-12-05 20:00:0 +0800
categories: android
---

## service的 生命周期
	    一旦在项目的任何位置调用了 Context 的 startService()方法,相应的服务就会启动起来,并回调
	onStartCommand()方法。如果这个服务之前还没有创建过,onCreate()方法会先于 
    onStartCommand()方法执行。服务启动了之后会一直保持运行状态,直到 stopService()或
    stopSelf()方法被调用。注意虽然每调用一次 startService()方法,onStartCommand()就会
    执行 一次,但实际上每个服务都只会存在一个实例。所以不管你调用了多少次startService()方法, 
    只需调用一次 stopService()或 stopSelf()方法,服务就会停止下来了。      
        另外,还可以调用 Context 的 bindService()来获取一个服务的持久连接,这时就会回调 服务
    中的 onBind()方法。类似地,如果这个服务之前还没有创建过,onCreate()方法会先于 
    onBind()方法执行。之后,调用方可以获取到 onBind()方法里返回的 IBinder 对象的实例,这
    样就能自由地和服务进行通信了。只要调用方和服务之间的连接没有断开,服务就会一直保 持运行状态。

        当调用了 startService()方法后,又去调用 stopService()方法,这时服务中的 onDestroy()
    方法就会执行,表示服务已经销毁了。类似地,当调用了 bindService()方法后,又去调用 
    unbindService()方法,onDestroy()方法也会执行,这两种情况都很好理解。但是需要注意, 
    我们是完全有可能对一个服务既调用了 startService()方法,又调用了 bindService()方法的,
    这种情况下该如何才能让服务销毁掉呢?根据 Android 系统的机制,一个服务只要被启动或 者被
    绑定了之后,就会一直处于运行状态,必须要让以上两种条件同时不满足,服务才能被 销毁。所以,
    这种情况下要同时调用 stopService()和 unbindService()方法,onDestroy()方法才 会执行。  
   
<!--more-->
## webview  
>permission  
	
	  <uses-permission android:name="android.permission.INTERNET" />  
	  
>xml
	
	<WebView
        android:id="@+id/web_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>  
            
>java
        
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webView = (WebView) findViewById(R.id.web_view);
        webView.getSettings().setJavaScriptEnabled(true);

        webView.setWebViewClient(
                new WebViewClient() {

                    @Override
                    public boolean shouldOverrideUrlLoading(WebView view,
                                                            String url) {
                        // 根据传入的参数再去加载新的网页
                        view.loadUrl(url);
                        // 表示当前WebView可以处理打开新网页的请求,不用借助系统浏览器
                        return true;
                    }
                }
        );

        webView.loadUrl("https://robertzhai.github.io");
    }
    
## client send request
> HttpURLConnection  
	
	private void sendRequestWithHttpURLConnection() {
        // 开启线程来发起网络请求

        new Thread(new Runnable() {
            @Override
            public void run() {
                HttpURLConnection connection = null;
                try {
                    URL url = new URL("https://robertzhai.github.io");
                    connection = (HttpURLConnection) url.openConnection();
                    connection.setRequestMethod("GET");
                    connection.setConnectTimeout(8000);
                    connection.setReadTimeout(8000);
                    InputStream in = connection.getInputStream(); //
                    // 下面对获取到的输入流进行读取
                    BufferedReader reader = new BufferedReader(new
                            InputStreamReader(in));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    
                    Log.i("response", response.toString());
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    if (connection != null) {
                        connection.disconnect();
                    }
                }
            }
        }).start();
    } 
    
    post usage:
    connection.setRequestMethod("POST");
	DataOutputStream out = new DataOutputStream(connection.getOutputStream()); 
	out.writeBytes("username=admin&password=123456");   
	
>HttpClient  
	
	is not supported any more in sdk 23
	
	
## parse json  
>JSONObject  

	private void parseJSONWithJSONObject(String jsonData) {
            try {
                JSONArray jsonArray = new JSONArray(jsonData);
                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject jsonObject = jsonArray.getJSONObject(i);
                    String id = jsonObject.getString("id");
                    String name = jsonObject.getString("name");
                    String version = jsonObject.getString("version");
                    Log.d("MainActivity", "id is " + id);
                    Log.d("MainActivity", "name is " + name);
                    Log.d("MainActivity", "version is " + version);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
	}		
	
>GSON

	 private void parseJSONWithGSON(String jsonData) {
            Gson gson = new Gson();
            List<App> appList = gson.fromJson(jsonData, new
    TypeToken<List<App>>() {}.getType());
            for (App app : appList) {
                Log.d("MainActivity", "id is " + app.getId());
                Log.d("MainActivity", "name is " + app.getName());
                Log.d("MainActivity", "version is " + app.getVersion());
	} }

## Intent 来传递对象  
>Serializable   

	Serializable 是序列化的意思,表示将一个对象转换成可存储或可传输的状态。序列化后 的对象可以
	在网络上进行传输,也可以存储到本地。至于序列化的方法也很简单,只需要让 一个类去实现 Serializable
	 这个接口就可以了。
	
	public class Person implements Serializable{
	
	private String name;
        private int age;
        public String getName() {
            return name;
	}
        public void setName(String name) {
            this.name = name;
	}
        public int getAge() {
            return age;
	}
        public void setAge(int age) {
            this.age = age;
	} }

	其中 get、set 方法都是用于赋值和读取字段数据的,最重要的部分是在第一行。这里让 Person 类去
	实现了 Serializable 接口,这样所有的 Person 对象就都是可序列化的了。
	接下来在 FirstActivity 中的写法非常简单:
	
    Person person = new Person();
    person.setName("Tom");
    person.setAge(20);
    Intent intent = new Intent(FirstActivity.this, SecondActivity.class);
    intent.putExtra("person_data", person);
    startActivity(intent);
	 
	 可以看到,这里我们创建了一个 Person 的实例,然后就直接将它传入到 putExtra()方法 中了。由于
	  Person 类实现了 Serializable 接口,所以才可以这样写。
	接下来在 SecondActivity 中获取这个对象也很简单,写法如下:
    Person person = (Person) getIntent().getSerializableExtra("person_data");
		这里调用了 getSerializableExtra()方法来获取通过参数传递过来的序列化对象,接着再将 
		它向下转型成 Person 对象,这样我们就成功实现了使用 Intent 来传递对象的功能了。
		
>Parcelable  

	除了 Serializable 之外,使用 Parcelable 也可以实现相同的效果,不过不同于将对象进行 序列化
	,Parcelable 方式的实现原理是将一个完整的对象进行分解,而分解后的每一部分都 是 Intent 所支
	持的数据类型,这样也就实现传递对象的功能了。
	
	public class Person implements Parcelable {
        private String name;
        private int age;
			......
        @Override
        public int describeContents() {
			return 0; }
        @Override
        public void writeToParcel(Parcel dest, int flags) {
	dest.writeString(name); // 写出name
	dest.writeInt(age); // 写出age }
	public static final Parcelable.Creator<Person> CREATOR = new Parcelable. Creator<Person>() {
            @Override
            public Person createFromParcel(Parcel source) {
	Person person = new Person();
	person.name = source.readString(); // 读取name 	person.age = source.readInt(); 
	// 读取age return person;
	}
            @Override
            public Person[] newArray(int size) {
                return new Person[size];
            }
	};
	}
	
	Parcelable 的实现方式要稍微复杂一些。可以看到,首先我们让 Person 类去实现了 Parcelable 
	接口,这样就必须重写 describeContents()和 writeToParcel()这两个方法。其中 
	describeContents()方法直接返回 0 就可以了,而 writeToParcel()方法中我们需要调用 
	Parcel 的 writeXxx()方法将 Person 类中的字段一一写出。注意字符串型数据就调用 
	writeString()方 法,整型数据就调用 writeInt()方法,以此类推。

	除此之外,我们还必须在 Person 类中提供一个名为 CREATOR 的常量,这里创建了 Parcelable.Creator 
	接口的一个实现,并将泛型指定为 Person。接着需要重写 createFromParcel() 和 newArray()这两个
	方法,在 createFromParcel()方法中我们要去读取刚才写出的 name 和 age 字段,并创建一个 Person 
	对象进行返回,其中 name 和 age 都是调用 Parcel 的 readXxx()方法 读取到的,注意这里读取的顺序
	一定要和刚才写出的顺序完全相同。而 newArray()方法中的 实现就简单多了,只需要 new 出一个 Person
	 数组,并使用方法中传入的 size 作为数组大小 就可以了。

	接下来在 FirstActivity 中我们仍然可以使用相同的代码来传递 Person 对象,只不过在 SecondActivity
	 中获取对象的时候需要稍加改动,如下所示:
    Person person = (Person) getIntent().getParcelableExtra("person_data");
    
    对比一下,Serializable 的方式较为简单,但由于会把整个对象进行序列化,因此效率方面会比 Parcelable 
    方式低一 些,所以在通常情况下还是更加推荐使用 Parcelable 的方式来实现 Intent 传递对象的功能。
    
## 自定义日志工具
	
	public class LogUtil {
        public static final int VERBOSE = 1;
        public static final int DEBUG = 2;
        public static final int INFO = 3;
        public static final int WARN = 4;
        public static final int ERROR = 5;
        public static final int NOTHING = 6;
        public static final int LEVEL = VERBOSE;
        public static void v(String tag, String msg) {
            if (LEVEL <= VERBOSE) {
                Log.v(tag, msg);
            }
			}
        public static void d(String tag, String msg) {
            if (LEVEL <= DEBUG) {
                Log.d(tag, msg);
            }
			}
        public static void i(String tag, String msg) {
            if (LEVEL <= INFO) {
                Log.i(tag, msg);
            }
			}
        public static void w(String tag, String msg) {
            if (LEVEL <= WARN) {
                Log.w(tag, msg);
                } }
        public static void e(String tag, String msg) {
            if (LEVEL <= ERROR) {
                Log.e(tag, msg);
            }
	} }
	

        
## 参考资料  

1.[第一行代码-android](https://github.com/robertzhai/ebooks/blob/master/android/%E7%AC%AC%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81%E2%80%94%E2%80%94Android.pdf)  
2.[http://blog.csdn.net/guolin_blog](http://blog.csdn.net/guolin_blog)