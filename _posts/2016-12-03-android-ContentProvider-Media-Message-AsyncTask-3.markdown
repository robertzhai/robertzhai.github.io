---
layout: post
title:  "android ContentProvider-Media-Message-AsyncTask 笔记（三）"
date:   2016-12-03 20:00:0 +0800
categories: android
---


## ContentResolver读取联系人
	public class MainActivity extends AppCompatActivity {

    ListView contactsView;
    ArrayAdapter<String> adapter;
    List<String> contactsList = new ArrayList<String>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.user);
        contactsView = (ListView) findViewById(R.id.contacts_view);
        adapter = new ArrayAdapter<String>(
                MainActivity.this,
                R.layout.user_item,
                contactsList);
        contactsView.setAdapter(adapter);
        readContacts();
    }    

    private void readContacts() {

        Cursor cursor = null;
        try {
            // 查询联系人数据
            cursor = getContentResolver().query(
                    ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                    null, null, null, null);

            while (cursor.moveToNext()) {
                // 获取联系人姓名
                String displayName = cursor.getString(cursor.getColumnIndex(
                        ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME))
                        ; // 获取联系人手机号
                String number = cursor.getString(cursor.getColumnIndex(
                        ContactsContract.CommonDataKinds.Phone.NUMBER));
                contactsList.add(displayName + "\n" + number);
            }
        } catch (Exception e) {
            Log.d("data", e.toString());
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }
    }
	}  
	
<!--more-->
## 自定义ContentResolver
>manifest注册provider
	
	<provider
            android:name="com.example.databasetest.DatabaseProvider"
            android:authorities="com.example.databasetest.provider"
            android:exported="true"
            >
        </provider>
        
>DatabaseProvider   
	
	public class DatabaseProvider extends ContentProvider {


    public static final int BOOK_DIR = 0;
    public static final int BOOK_ITEM = 1;
    public static final int CATEGORY_DIR = 2;
    public static final int CATEGORY_ITEM = 3;
    public static final String AUTHORITY = "com.example.databasetest.provider";
    private static UriMatcher uriMatcher;
    private MyDatabaseHelper dbHelper;

    static {
        uriMatcher = new UriMatcher(UriMatcher.NO_MATCH);
        uriMatcher.addURI(AUTHORITY, "book", BOOK_DIR);
        uriMatcher.addURI(AUTHORITY, "book/#", BOOK_ITEM);
        uriMatcher.addURI(AUTHORITY, "category", CATEGORY_DIR);
        uriMatcher.addURI(AUTHORITY, "category/#", CATEGORY_ITEM);
    }

    @Override
    public boolean onCreate() {
        dbHelper = new MyDatabaseHelper(getContext(), "BookStore.db", null, 2);
        return true;
    }

    @Nullable
    @Override
    public Cursor query(Uri uri, String[] projection, String selection,
                        String[] selectionArgs, String sortOrder) {
        // 查询数据
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = null;
        switch (uriMatcher.match(uri)) {
            case BOOK_DIR:
                cursor = db.query("Book", projection, selection,
                        selectionArgs, null, null, sortOrder);
                break;
            case BOOK_ITEM:
                String bookId = uri.getPathSegments().get(1);
                cursor = db.query("Book", projection, "id = ?", new String[]
                        {bookId}, null, null, sortOrder);
                break;
            case CATEGORY_DIR:
                cursor = db.query("Category", projection, selection,
                        selectionArgs, null, null, sortOrder);
                break;
            case CATEGORY_ITEM:
                String categoryId = uri.getPathSegments().get(1);
                cursor = db.query("Category", projection, "id = ?", new
                        String[]{categoryId}, null, null, sortOrder);
                break;
            default:
                break;
        }
        return cursor;
    }

    @Nullable
    @Override
    public String getType(Uri uri) {
        switch (uriMatcher.match(uri)) {
            case BOOK_DIR:
                return "vnd.android.cursor.dir/vnd.com.example.databasetest.provider.book";
            case BOOK_ITEM:
                return "vnd.android.cursor.item/vnd.com.example.databasetest.provider.book";
            case CATEGORY_DIR:
                return "vnd.android.cursor.dir/vnd.com.example.databasetest.provider.category";
            case CATEGORY_ITEM:
                return "vnd.android.cursor.item/vnd.com.example.databasetest.provider.category";
        }
        return null;
    }

    @Nullable
    @Override
    public Uri insert(Uri uri, ContentValues values) {
        // 添加数据
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        Uri uriReturn = null;
        switch (uriMatcher.match(uri)) {
            case BOOK_DIR:
            case BOOK_ITEM:
                long newBookId = db.insert("Book", null, values);
                uriReturn = Uri.parse("content://" + AUTHORITY + "/book/" +
                        newBookId);
                break;
            case CATEGORY_DIR:
            case CATEGORY_ITEM:
                long newCategoryId = db.insert("Category", null, values);
                uriReturn = Uri.parse("content://" + AUTHORITY + "/category/"
                        + newCategoryId);
                break;
            default:
                break;
        }
        return uriReturn;
    }

    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        // 删除数据
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        int deletedRows = 0;
        switch (uriMatcher.match(uri)) {
            case BOOK_DIR:
                deletedRows = db.delete("Book", selection, selectionArgs);
                break;
            case BOOK_ITEM:
                String bookId = uri.getPathSegments().get(1);
                deletedRows = db.delete("Book", "id = ?", new String[]{bookId});
                break;
            case CATEGORY_DIR:
                deletedRows = db.delete("Category", selection, selectionArgs);
                break;
            case CATEGORY_ITEM:
                String categoryId = uri.getPathSegments().get(1);
                deletedRows = db.delete("Category", "id = ?", new String[]
                        {categoryId});
                break;
            default:
                break;
        }
        return deletedRows;
    }

    @Override
    public int update(Uri uri, ContentValues values, String selection,
                      String[] selectionArgs) {
        // 更新数据
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        int updatedRows = 0;
        switch (uriMatcher.match(uri)) {
            case BOOK_DIR:
                updatedRows = db.update("Book", values, selection,
                        selectionArgs);
                break;
            case BOOK_ITEM:
                String bookId = uri.getPathSegments().get(1);
                updatedRows = db.update("Book", values, "id = ?", new
                        String[]{bookId});
                break;
            case CATEGORY_DIR:
                updatedRows = db.update("Category", values, selection,
                        selectionArgs);
                break;
            case CATEGORY_ITEM:
                String categoryId = uri.getPathSegments().get(1);
                updatedRows = db.update("Category", values, "id = ?", new
                        String[]{categoryId});
                break;
            default:
                break;
        }
        return updatedRows;

    }
	}

>CRUD   
		
		public class MainActivity extends AppCompatActivity {

    private String newId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button addData = (Button) findViewById(R.id.add_data);
        addData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 添加数据
                Uri uri = Uri.parse("content://com.example.databasetest" +
                        ".provider/book");
                ContentValues values = new ContentValues();
                values.put("name", "A Clash of Kings");
                values.put("author", "George Martin");
                values.put("pages", 1040);
                values.put("price", 22.85);
                Uri newUri = getContentResolver().insert(uri, values);
                newId = newUri.getPathSegments().get(1);
            }
        });

        Button queryData = (Button) findViewById(R.id.query_data);
        queryData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
	// 查询数据
                Uri uri = Uri.parse("content://com.example.databasetest" +
                        ".provider/book");
                Cursor cursor = getContentResolver().query(uri, null, null,
                        null, null);
                if (cursor != null) {
                    while (cursor.moveToNext()) {
                        String name = cursor.getString(cursor.
                                getColumnIndex("name"));
                        String author = cursor.getString(cursor.
                                getColumnIndex("author"));
                        int pages = cursor.getInt(cursor.getColumnIndex
                                ("pages"));

                        double price = cursor.getDouble(cursor.
                                getColumnIndex("price"));
                        Log.d("MainActivity", "book name is " + name);
                        Log.d("MainActivity", "book author is " + author);
                        Log.d("MainActivity", "book pages is " + pages);
                        Log.d("MainActivity", "book price is " + price);
                    }
                    cursor.close();
                }
            }
        });


        Button updateData = (Button) findViewById(R.id.update_data);
        updateData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
	// 更新数据
                Uri uri = Uri.parse("content://com.example.databasetest" +
                        ".provider/book/" + newId);
                ContentValues values = new ContentValues();
                values.put("name", "A Storm of Swords");
                values.put("pages", 1216);
                values.put("price", 24.05);
                getContentResolver().update(uri, values, null, null);
            }
        });
        Button deleteData = (Button) findViewById(R.id.delete_data);
        deleteData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
	
	// 删除数据
                Uri uri = Uri.parse("content://com.example.databasetest" +
                        ".provider/book/" + newId);
                getContentResolver().delete(uri, null, null);
            }
        });
    }
	}

## adb shell 查看模拟器中sqlite数据表数据步骤
	$ adb shell
	#cd /data/data/com.example.databasetest/databases
	#sqlite3 BookStore.db
	sqlite>.talbles
	sqlite>select * from Book
	

## 拍照

	<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
	
	public class MainActivity extends AppCompatActivity {

    public static final int TAKE_PHOTO = 1;
    public static final int CROP_PHOTO = 2;
    private Button takePhoto;
    private ImageView picture;
    private Uri imageUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        takePhoto = (Button) findViewById(R.id.take_photo);
        picture = (ImageView) findViewById(R.id.picture);

        takePhoto.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 创建File对象,用于存储拍照后的图片
                File outputImage = new File(Environment.
                        getExternalStorageDirectory(), "tempImage.jpg");
                try {
                    if (outputImage.exists()) {
                        outputImage.delete();
                    }
                    outputImage.createNewFile();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                imageUri = Uri.fromFile(outputImage);
                Intent intent = new Intent("android.media.action." +
                        "IMAGE_CAPTURE");
                intent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
                startActivityForResult(intent, TAKE_PHOTO); // 启动相机程序
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent
            data) {

        switch (requestCode) {
            case TAKE_PHOTO:
                if (resultCode == RESULT_OK) {
                    Intent intent = new Intent("com.android.camera.action" +
                            ".CROP");
                    intent.setDataAndType(imageUri, "image/*");
                    intent.putExtra("scale", true);
                    intent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
                    startActivityForResult(intent, CROP_PHOTO); // 启动裁剪程序
                }
                break;

            case CROP_PHOTO:
                if (resultCode == RESULT_OK) {
                    try {
                        Bitmap bitmap = BitmapFactory.decodeStream
                                (getContentResolver()
                                        .openInputStream(imageUri));
                        picture.setImageBitmap(bitmap); // 将裁剪后的照片显示出来
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    }
                }
                break;
            default:
                break;
        }
    }
	}
	
## 线程的基本用法  

	Android 多线程编程其实并不比 Java 多线程编程特珠,基本都是使用相同的语法。比如说,定义一个线
	程只需要新建一个类继承自 Thread,然后重写父类的 run()方法,并在里面 编写耗时逻辑即可,如下所示:
    class MyThread extends Thread {
        @Override
        public void run() {
	// 处理具体的逻辑 }
	}
	那么该如何启动这个线程呢?其实也很简单,只需要 new 出 MyThread 的实例,然后调 用它的 start()
	方法,这样 run()方法中的代码就会在子线程当中运行了,如下所示:
    new MyThread().start();
	当然,使用继承的方式耦合性有点高,更多的时候我们都会选择使用实现 Runnable 接 口的方式来定义
	一个线程,如下所示:
    class MyThread implements Runnable {
        @Override
        public void run() {
	// 处理具体的逻辑 }
	}
	如果使用了这种写法,启动线程的方法也需要进行相应的改变,如下所示:
    MyThread myThread = new MyThread();
    new Thread(myThread).start();
    
    	当然,如果你不想专门再定义一个类去实现 Runnable 接口,也可以使用匿名类的方式,
	这种写法更为常见,如下所示:
    new Thread(new Runnable() {
        @Override
        public void run() {
	// 处理具体的逻辑 }
	}).start();
	
## 在子线程中更新 UI  

		和许多其他的 GUI 库一样,Android 的 UI 也是线程不安全的。也就是说,如果想要更 新应用程序
		里的 UI 元素,则必须在主线程中进行,否则就会出现异常。

>解析异步消息处理机制  
	
	Android 中的异步消息处理主要由四个部分组成,Message、Handler、MessageQueue 和 Looper。
	其中 Message 和 Handler 在上一小节中我们已经接触过了,而 MessageQueue 和 Looper 对于
	你来说还是全新的概念,下面我就对这四个部分进行一下简要的介绍。
	1. Message
	Message 是在线程之间传递的消息,它可以在内部携带少量的信息,用于在不同线程之间交换数据。上一
	小节中我们使用到了 Message 的 what 字段,除此之外还可以使 用 arg1 和 arg2 字段来携带一些
	整型数据,使用 obj 字段携带一个 Object 对象。
	2. Handler
	Handler 顾名思义也就是处理者的意思,它主要是用于发送和处理消息的。发送消 息一般是使用 
	Handler 的 sendMessage()方法,而发出的消息经过一系列地辗转处理后, 最终会传递到 Handler 
	的 handleMessage()方法中。
	3. MessageQueue
	MessageQueue 是消息队列的意思,它主要用于存放所有通过 Handler 发送的消息。 这部分消息会一
	直存在于消息队列中,等待被处理。每个线程中只会有一个 MessageQueue 对象。
	4. Looper
	Looper 是每个线程中的 MessageQueue 的管家,调用 Looper 的 loop()方法后,就会 进入到一个
	无限循环当中,然后每当发现 MessageQueue 中存在一条消息,就会将它取 出,并传递到 Handler 的 
	handleMessage()方法中。每个线程中也只会有一个 Looper 对象。 了解了 Message、Handler、
	MessageQueue 以及 Looper 的基本概念后,我们再来对异步消息处理的整个流程梳理一遍。
	首先需要在主线程当中创建一个 Handler 对象,并重写 handleMessage()方法。然后当子线程中需要
	进行 UI 操作时,就创建一个 Message 对象,并 通过 Handler 将这条消息发送出去。之后这条消息
	会被添加到 MessageQueue 的队列中等待 被处理,而 Looper 则会一直尝试从 MessageQueue 中
	取出待处理消息,最后分发回 Handler 的 handleMessage()方法中。由于 Handler 是在主线程中
	创建的,所以此时 handleMessage()方 法中的代码也会在主线程中运行,于是我们在这里就可以安心地
	进行 UI 操作了。

>![stylin_with_css]({{ site.url }}/assets/android/android-message-loop.png)


> Handler 的代码实例

	public class MainActivity extends AppCompatActivity implements View
        .OnClickListener {


    public static final int UPDATE_TEXT = 1;

    private TextView text;
    private Button changeText;

    private Handler handler = new Handler() {
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case UPDATE_TEXT:
	// 在这里可以进行UI操作
                    text.setText("Nice to meet you");
                    break;
                default:
                    break;
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        text = (TextView) findViewById(R.id.text);
        changeText = (Button) findViewById(R.id.change_text);
        changeText.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {

        switch (v.getId()) {
            case R.id.change_text:
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        Message message = new Message();
                        message.what = UPDATE_TEXT;
                        handler.sendMessage(message); // 将Message对象发送出去
                    }
                }).start();
                break;
            default:
                break;
        }
    }
	}
	

> AsyncTask   
 
		不过为了更加方便我们在子线程中对 UI 进行操作,Android 还提供了另外一些好用的工 
		具,AsyncTask 就是其中之一。借助 AsyncTask,即使你对异步消息处理机制完全不了解, 也可
		以十分简单地从子线程切换到主线程。当然,AsyncTask 背后的实现原理也是基于异步 消息处理机
		制的,只是 Android 帮我们做了很好的封装而已。
		需要去重写 AsyncTask 中的几个方法才能完成对任务的定制。经常需要去重写的方法 有以下四个。
	1. onPreExecute()
	这个方法会在后台任务开始执行之前调用,用于进行一些界面上的初始化操作,比 如显示一个进度条对话框等。
	2. doInBackground(Params...)
	这个方法中的所有代码都会在子线程中运行,我们应该在这里去处理所有的耗时任 务。任务一旦完成就可以
	通过 return 语句来将任务的执行结果返回,如果 AsyncTask 的 第三个泛型参数指定的是 Void,就
	可以不返回任务执行结果。注意,在这个方法中是不 可以进行 UI 操作的,如果需要更新 UI 元素,比如说
	反馈当前任务的执行进度,可以调 用 publishProgress(Progress...)方法来完成。
	
	3. onProgressUpdate(Progress...)
	当在后台任务中调用了 publishProgress(Progress...)方法后,	这个方法就会很快被调用,方法中
	携带的参数就是在后台任务中传递过来的。在这个方法中可以对 UI 进行操 作,利用参数中的数值就可以
	对界面元素进行相应地更新。  
	4. onPostExecute(Result)
	当后台任务执行完毕并通过 return 语句进行返回时,这个方法就很快会被调用。返 回的数据会作为参
	数传递到此方法中,可以利用返回的数据来进行一些 UI 操作,比如 说提醒任务执行的结果,以及关闭掉
	进度条对话框等。
	因此,一个比较完整的自定义 AsyncTask 就可以写成如下方式:
	class DownloadTask extends AsyncTask<Void, Integer, Boolean> {
	@Override

			protected void onPreExecute() 	{ 
			progressDialog.show(); // 显示进度对话框
	}
    @Override
    protected Boolean doInBackground(Void... params) {
        try {
            while (true) {
	int downloadPercent = doDownload(); 
	// 这是一个虚构的方法 publishProgress(downloadPercent);
	if (downloadPercent >= 100) {
	break; }
            }
        } catch (Exception e) {
            return false;
        }
        return true;
    }
    @Override
    protected void onProgressUpdate(Integer... values) {
	// 在这里更新下载进度
        progressDialog.setMessage("Downloaded " + values[0] + "%");
    }
    @Override
    protected void onPostExecute(Boolean result) {
	progressDialog.dismiss(); // 关闭进度对话框 // 在这里提示下载结果
	if (result) {
            Toast.makeText(context, "Download succeeded",Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(context, " Download failed",Toast.LENGTH_SHORT).show();
        }
	} }
	
    简单来说,使用 AsyncTask 的诀窍就是,在 doInBackground()方法中去执行具体的耗时 任务,
    在 onProgressUpdate()方法中进行 UI 操作,在 onPostExecute()方法中执行一些任务的 
    收尾工作。
    如果想要启动这个任务,只需编写以下代码即可:
    new DownloadTask().execute();    
          
## 参考资料  

1.[第一行代码-android](https://github.com/robertzhai/ebooks/blob/master/android/%E7%AC%AC%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81%E2%80%94%E2%80%94Android.pdf)  