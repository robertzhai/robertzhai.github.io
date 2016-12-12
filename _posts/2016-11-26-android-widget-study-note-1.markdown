---
layout: post
title:  "android组件学习笔记（一）"
date:   2016-11-26 17:0:0 +0800
categories: android
---


## Toast 提示
	   Toast.makeText(MainActivity.this, "toast content", Toast.LENGTH_SHORT).show();


## EditText设置行数
	<EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="type something here"
        android:maxLines="5"
        android:id="@+id/editText" />  

## ImageView替换图片
	imageView = (ImageView) findViewById(R.id.imageView);
	imageView.setImageResource(R.mipmap.ic_sunshine);
	
## TextView
	<TextView
        android:id="@+id/text_view"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:textSize="24sp"
        android:textColor="#00ff00"
        android:text="This is TextView" />
	
## Button 绑定事件
>implements View.OnClickListener  
 
	public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private Button button;
    private EditText editText;
    private ImageView imageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        button = (Button) findViewById(R.id.button);
        editText = (EditText) findViewById(R.id.editText);
        button.setOnClickListener(this);
        imageView = (ImageView) findViewById(R.id.imageView);
    }

    @Override
    public void onClick(View v) {

        switch (v.getId()) {
            case R.id.button:
                imageView.setImageResource(R.mipmap.ic_sunshine);
                break;
            default:
                break;
        }

    }
	}
        
        
>或者通过   

  
	findViewById(R.id.button).setOnClickListener()这种匿名类来实现
	findViewById(R.id.btnMode).setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(FirstActivity.this, FirstActivity.class);
                        startActivity(intent);
                    }
                }
        );

## progressBar 隐藏和进度控制
>隐藏  

	progressBar = (ProgressBar) findViewById(R.id.progressBar);
	if (progressBar.getVisibility() == View.GONE) {
                    progressBar.setVisibility(View.VISIBLE);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
                
>进度控制  

	<ProgressBar
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        style="?android:attr/progressBarStyleHorizontal"
        android:max="100"
        android:id="@+id/progressBar" />  
        
	int progress = progressBar.getProgress();
                progress += 10;
                progressBar.setProgress(progress);
                
## AlertDialog
	
	AlertDialog.Builder dialog = new AlertDialog.Builder(MainActivity.this);
	dialog.setTitle("this is dialog");
	dialog.setMessage("dialog dialog");
	//将对话框设为不可取消（不能使用back键来取消）
	dialog.setCancelable(false);
	dialog.setPositiveButton("OK", new DialogInterface.OnClickListener() {
	    @Override
	    public void onClick(DialogInterface dialog, int which) {
	    }
	});
	dialog.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
	    @Override
	    public void onClick(DialogInterface dialog, int which) {
	
	    }
	});
	dialog.show();
                
## ProgressDialog

	ProgressDialog dialog = new ProgressDialog
                        (MainActivity.this);
    dialog.setTitle("this is dialog");
    dialog.setMessage("Loading...");
    dialog.setCancelable(true);

    dialog.show();
    
## 自定义标题组件  

>main.xml  
  
  
	<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/activity_main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"

    tools:context="com.example.uicustomviews.MainActivity">

    <com.example.uicustomviews.TitleLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

    </com.example.uicustomviews.TitleLayout>
    </LinearLayout>
        
        
>title.xml  
  
	<?xml version="1.0" encoding="utf-8"?>
    <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal">

    <Button
        android:id="@+id/title_back"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="left"
        android:layout_margin="5dp"
        android:text="Back"
        android:textColor="#fff"
        />

    <TextView
        android:id="@+id/title_text"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_weight="1"
        android:text="Title Text"
        android:textColor="#fff"
        android:textSize="24sp"
        />

    <Button
        android:id="@+id/title_edit"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="right"
        android:layout_margin="5dip"
        android:text="Edit"
        android:textColor="#fff"
        />
    </LinearLayout>
        
        
>TitleLayout.java    

	public class TitleLayout extends LinearLayout {


    private android.widget.Button titleBack;
    private android.widget.TextView titleText;
    private android.widget.Button titleEdit;

    public TitleLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
        LayoutInflater.from(context).inflate(R.layout.title, this);
        initView();
        titleBack.setOnClickListener(
                new OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        ((Activity) getContext()).finish();
                    }
                }
        );
        titleEdit.setOnClickListener(
                new OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Toast.makeText(getContext(), "you clicked edit button",
                                Toast.LENGTH_SHORT).show();
                    }
                }
        );


    }

    private void initView() {
        titleBack = (Button) findViewById(R.id.title_back);
        titleText = (TextView) findViewById(R.id.title_text);
        titleEdit = (Button) findViewById(R.id.title_edit);
    }
	}
	
## listview 列表展示  

>水果展示列表ViewHolder优化  

    
	public class FruitAdapter extends ArrayAdapter<Fruit> {

    private int resourceId;

    public FruitAdapter(Context context, int resource, List<Fruit> objects) {
        super(context, resource, objects);
        resourceId = resource;
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        Fruit fruit = getItem(position);

        View view;

        ViewHolder viewHolder;

        if (convertView == null) {
            view = LayoutInflater.from(getContext()).inflate(resourceId, null);
            viewHolder = new ViewHolder();
            viewHolder.fruitImage = (ImageView) view.findViewById(R.id
                    .fruit_image);
            viewHolder.fruitName = (TextView) view.findViewById(R.id
                    .fruit_name);
            view.setTag(viewHolder);
        } else {
            view = convertView;
            viewHolder = (ViewHolder) view.getTag();
            
            
        }
        viewHolder.fruitImage.setImageResource(fruit.getImageId());
        viewHolder.fruitName.setText(fruit.getName());
        Log.d("fruit", fruit.toString());
        return view;
    }

    class ViewHolder {
        ImageView fruitImage;
        TextView fruitName;
    }
	}  
   
   		
>adapter数据源  
	
	protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initFruits();
        FruitAdapter adapter = new FruitAdapter(
                MainActivity.this,
                R.layout.fruit_item,
                fruitList
        );

        ListView listView = (ListView) findViewById(R.id.list_view);
        listView.setAdapter(adapter);
    }
        
            
>列表itemclick事件  

	listView.setOnItemClickListener(
                new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view,
                                            int position, long id) {
                        Fruit fruit = fruitList.get(position);
                        Toast.makeText(MainActivity.this,
                                fruit.getName(),
                                Toast.LENGTH_SHORT).show();
                    }
                }
        );

        
          
## 参考资料  

1.[第一行代码-android](https://github.com/robertzhai/ebooks/blob/master/android/%E7%AC%AC%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81%E2%80%94%E2%80%94Android.pdf)  