---
layout: post
title:  "android碎片、广播、文件、sqlite存储笔记（二）"
date:   2016-11-30 8:30:0 +0800
categories: android
---


# 1.dp、sp和密度
    dp 是密度无关像素的意思,也被称作 dip,和 px 相比,它在不同密度的屏幕中的显示比 例将保持一致。
    sp 是可伸缩像素的意思,它采用了和 dp 同样的设计理念,解决了文字大小的适配问题。
    Android 中的密度就是屏幕每英 寸所包含的像素数,通常以 dpi 为单位。比如一个手机屏幕的宽是 2 
    英寸长是 3 英寸,如果 它的分辨率是 320*480 像素,那这个屏幕的密度就是 160dpi,如果它的分辨率
    是 640*960, 那这个屏幕的密度就是 320dpi,因此密度值越高的屏幕显示的效果就越精细。
    在 160dpi 的屏幕上,1dp 等于 1px,而在 320dpi 的屏幕上,1dp 就等于 2px。因此,使用 dp 来
    指定控件的宽和高,就可以保证控件在不同密度的屏幕中的 显示比例保持一致。
    尽量将控件或布局的大小指定成 match_parent 或 wrap_content,如果必须要指定一个固定值,则使
    用 dp 来作为单位,指定文字大小的时候 使用 sp 作为单位。


# 2.fragment动态替换  		
	动态添加碎片主要分为 5 步。
	1. 创建待添加的碎片实例。  
	2. 获取到 FragmentManager,在活动中可以直接调用 	getFragmentManager()方法得到。
	3. 开启一个事务,通过调用 beginTransaction()方法开启。
	4. 向容器内加入碎片,一般使用 replace()方法实现,需要传入容器	的 id 和待添加的碎片实例。
	5. 提交事务,调用 commit()方法来完成。  
	
	<?xml version="1.0" encoding="utf-8"?>
	<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/activity_main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="horizontal"
    tools:context="com.example.fragmenttest.MainActivity">
    <fragment
        android:id="@+id/left_fragment"
        android:name="com.example.fragmenttest.LeftFragment"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1"
        />
    <FrameLayout
        android:id="@+id/right_layout"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1">
        <fragment
            android:id="@+id/righ_fragment"
            android:name="com.example.fragmenttest.RightFragment"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            />
    </FrameLayout>
    </LinearLayout>

	AnotherRightFragment fragment = new AnotherRightFragment();
                FragmentManager fragmentManager = getSupportFragmentManager();
                FragmentTransaction fragmentTransaction = fragmentManager
                        .beginTransaction();
                fragmentTransaction.replace(R.id.right_layout, fragment);
                fragmentTransaction.addToBackStack(null);
                fragmentTransaction.commit();
                

# 3.fragment 和 activity 通信   
>1.activity 获取 fragment  
 
	RightFragment rightFragment = (RightFragment) getFragmentManager()
            .findFragmentById(R.id.right_fragment);  
            
>2.fragment获取所在activity   

	MainActivity activity = (MainActivity) getActivity();
	
# 4.简化启动另一个activity的方法
	
	在NewsContentActivity加入actionStart方法
	
	public class NewsContentActivity extends AppCompatActivity {


    public static void actionStart(Context context, 					
    String newsTitle,
					String newsContent) {
					
        Intent intent = new Intent(context, NewsContentActivity.class);
        intent.putExtra("news_title", newsTitle);
        intent.putExtra("news_content", newsContent);
        context.startActivity(intent);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.news_content);

        String newsTitle = getIntent().getStringExtra("news_title");
	// 获取传入的新闻标题
        String newsContent = getIntent().getStringExtra("news_content");
	// 获取传入的新闻内容
        NewsContentFragment newsContentFragment = (NewsContentFragment)
                getSupportFragmentManager()
                .findFragmentById(R.id.news_content_fragment);
        newsContentFragment.refresh(newsTitle, newsContent);
        // 刷新NewsContentFragment界面
    }
	}
    
    按下面调用即可启动 
   	NewsContentActivity.actionStart
                   (getActivity(), 
                    news.getTitle(),
                    news.getContent());
                    

# 5.监听网络变化的广播
	public class MainActivity extends AppCompatActivity {

    private IntentFilter intentFilter;

    private NetworkChangeReceiver networkChangeReceiver;


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        intentFilter = new IntentFilter();
        intentFilter.addAction("android.net.conn.CONNECTIVITY_CHANGE");

        networkChangeReceiver = new NetworkChangeReceiver();
        registerReceiver(networkChangeReceiver, intentFilter);

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unregisterReceiver(networkChangeReceiver);
    }

    class NetworkChangeReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {

            ConnectivityManager connectivityManager = (ConnectivityManager)
                    context
                            .getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo networkInfo = connectivityManager
                    .getActiveNetworkInfo();

            if (networkInfo != null && networkInfo.isAvailable()) {
                Toast.makeText(context, "network available", Toast.LENGTH_SHORT)
                        .show();
            } else {
                Toast.makeText(context, "network unavailable", Toast
                        .LENGTH_SHORT)
                        .show();
            }
        }
    }
}

# 6.发送标准广播
	
	public class MyBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Toast.makeText(context, "received in MyBroadcastReceiver",
                Toast.LENGTH_SHORT).show();
    }
	}
	Intent intent = new Intent("com.example.broadcasttest" +
                                ".MY_BROADCAST");
                        sendBroadcast(intent);
                        
# 7.读写文件
	public class MainActivity extends AppCompatActivity {

    private EditText editText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        editText = (EditText) findViewById(R.id.edit);
        String inputText = load();
        if (!TextUtils.isEmpty(inputText)) {
            editText.setText(inputText);
            editText.setSelection(inputText.length());
            Toast.makeText(this, "load success", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d("data", "onDestroy");
        String text = editText.getText().toString();
        save(text);
    }

    private void save(String inputText) {

        Log.d("data", inputText);
        FileOutputStream out = null;
        BufferedWriter writer = null;
        try {
        /*所有的文件都是默认存储到/data/data/<package name>/files/目录下的
        MODE_PRIVATE 是默认的操作模式,表示当指 定同样文件名的时候,所写入的内容
        将会覆盖原文件中的内容,而 MODE_APPEND 则表示 如果该文件已存在就往文件里
        面追加内容,不存在就创建新文件
        */
            out = openFileOutput("data", Context.MODE_PRIVATE);
            writer = new BufferedWriter(new OutputStreamWriter(out));
            writer.write(inputText);
        } catch (Exception e) {
            Log.d("data", e.toString());
            e.printStackTrace();
        } finally {
            try {
                if (writer != null) {
                    writer.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
    }

    private String load() {

        FileInputStream in = null;
        BufferedReader reader = null;
        StringBuilder content = new StringBuilder();
        try {
        //系统会自动到/data/data/<package name>/files/目录下去加载这个文件
            in = openFileInput("data");
            reader = new BufferedReader(new InputStreamReader(in));
            String line = "";
            while ((line = reader.readLine()) != null) {
                content.append(line);
            }
        } catch (Exception e) {
            Log.d("data", e.toString());
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        Log.d("data", content.toString());

        return content.toString();
    }
	}
	
# 8.SharedPreferences 读写数据  
    SharedPreferences 文件都是存放在/data/data/<package name>/shared_prefs/目录下的。
    第二个参数用于指定操作模式,主要有两种模式可以选 择,MODE_PRIVATE 和 MODE_MULTI_PROCESS。
    MODE_PRIVATE 仍然是默认的操 作模式,和直接传入 0 效果是相同的,表示只有当前的应用程序才可以
    对这个 SharedPreferences 文件进行读写。MODE_MULTI_PROCESS 则一般是用于会有多个进程中 
    对同一个 SharedPreferences 文件进行读写的情况  
				
>write  

	SharedPreferences.Editor editor = getSharedPreferences
                        ("data", MODE_PRIVATE).edit();
                editor.putString("name", "Tom");
                editor.putInt("age", 28);
                editor.putBoolean("married", false);
                editor.commit();
>read  
	
	SharedPreferences pref = getSharedPreferences("data",
                        MODE_PRIVATE);
                String name = pref.getString("name", "");
                int age = pref.getInt("age", 0);
                boolean married = pref.getBoolean("married", false);
                Log.d("MainActivity", "name is " + name);
                Log.d("MainActivity", "age is " + age);
                Log.d("MainActivity", "married is " + married);

# 9.SQLite 数据库存储
    参考：https://www.oschina.net/question/12_53183  
>事务  

	SQLiteDatabase db = dbHelper.getWritableDatabase(); 
	db.beginTransaction(); // 开启事务
	try {
        db.delete("Book", null, null);
        if (true) {
	// 在这里手动抛出一个异常,让事务失败
           //throw new NullPointerException();
         }
		ContentValues values = new ContentValues(); 	
		values.put("name", "Game of Thrones"); 	
		values.put("author", "George Martin"); 	
		values.put("pages", 720);
        values.put("price", 20.85);
        db.insert("Book", null, values); 	
        db.setTransactionSuccessful(); // 事务已经执行成功
    } catch (Exception e) {
        e.printStackTrace();
	} finally {
	    db.endTransaction(); // 结束事务
	} }
	
>更新  
	
	SQLiteDatabase db = dbHelper.getWritableDatabase();
                ContentValues values = new ContentValues();
                values.put("price", 10.99);
                db.update("Book", values, "name = ?", new String[]{"The Lost Symbol"});
                
>插入	
	
	SQLiteDatabase db = dbHelper.getWritableDatabase();
                ContentValues values = new ContentValues();
	// 开始组装第一条数据
    values.put("name", "The Da Vinci Code");
    values.put("author", "Dan Brown");
    values.put("pages", 454);
    values.put("price", 16.96);
    db.insert("Book", null, values);
    // 插入第一条数据
    values.clear();     
          
# 参考资料  

1.[第一行代码-android](https://github.com/robertzhai/ebooks/blob/master/android/%E7%AC%AC%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81%E2%80%94%E2%80%94Android.pdf)  