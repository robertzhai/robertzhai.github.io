---
layout: post
title:  "search-coreseek-sphinx"
date:   2017-9-24 20:30:0 +0800
categories: search
---

coreseek 是 sphinx的支持中文版的改造版本，对中文支持，可以直接使用。
下面总结下安装和使用方法。

# coreseek下载
> wget http://pppboy.com/wp-content/uploads/2016/02/coreseek-3.2.14.tar.gz,或者直接

[点击下载,coreseek-3.2.14.tar.gz]({{ site.url }}/assets/search/coreseek-3.2.14.tar.gz)

# 安装 mmseg3
    tar zxvf coreseek-3.2.14.tar.gz
    cd coreseek-3.2.14/mmseg-3.2.14
     sh bootstrap
     autoreconf -ivf
     ./configure --prefix=/usr/local/mmseg3
     make
     
     make 报错解决：
         vim src/css/ThesaurusDict.h
         ###在头部找到：#include <string>
         
         ###再其下加入一行代码：
         
         #include <ext/hash_map>


# 安装coreseek
    cd csft-3.2.14
    sh buildconf.sh
    ./configure --prefix=/usr/local/coreseek  --without-unixodbc --with-mmseg --with-mmseg-includes=/usr/local/mmseg3/include/mmseg/ --with-mmseg-libs=/usr/local/mmseg3/lib/ --with-mysql  --with-mysql-includes=/usr/local/Cellar/mysql/5.6.26/include/mysql --with-mysql-libs=/usr/local/Cellar/mysql/5.6.26/lib

    use of undeclared identifier 'ExprEval'
    解决方法：修改源代码。
    vim src/sphinxexpr.cpp
    
    将T val = ExprEval( this->m_pArg, tMatch )替换为T val = this->ExprEval ( this->m_pArg, tMatch )

# coreseek配置

![csft.conf]({{ site.url }}/assets/search/csft.conf)

    source cn360
    {
    	# data source type. mandatory, no default value
    	# known types are mysql, pgsql, mssql, xmlpipe, xmlpipe2, odbc
    	type					= mysql
    
    	#####################################################################
    	## SQL settings (for 'mysql' and 'pgsql' types)
    	#####################################################################
    
    	# some straightforward parameters for SQL source types
    	sql_host				= localhost
    	sql_user				= test
    	sql_pass				= test
    	sql_db					= python
    	sql_port				= 3306	# optional, default is 3306
    
    	# UNIX socket name
    	# optional, default is empty (reuse client library defaults)
    	# usually '/var/lib/mysql/mysql.sock' on Linux
    	# usually '/tmp/mysql.sock' on FreeBSD
    	#
    	# sql_sock				= /tmp/mysql.sock
    
    
    	# MySQL specific client connection flags
    	# optional, default is 0
    	#
    	# mysql_connect_flags	= 32 # enable compression
    
    	# MySQL specific SSL certificate settings
    	# optional, defaults are empty
    	#
    	# mysql_ssl_cert		= /etc/ssl/client-cert.pem
    	# mysql_ssl_key		= /etc/ssl/client-key.pem
    	# mysql_ssl_ca		= /etc/ssl/cacert.pem
    
    	# MS SQL specific Windows authentication mode flag
    	# MUST be in sync with charset_type index-level setting
    	# optional, default is 0
    	#
    	# mssql_winauth			= 1 # use currently logged on user credentials
    
    
    	# MS SQL specific Unicode indexing flag
    	# optional, default is 0 (request SBCS data)
    	#
    	# mssql_unicode			= 1 # request Unicode data from server
    
    
    	# ODBC specific DSN (data source name)
    	# mandatory for odbc source type, no default value
    	#
    	# odbc_dsn				= DBQ=C:\data;DefaultDir=C:\data;Driver={Microsoft Text Driver (*.txt; *.csv)};
    	# sql_query				= SELECT id, data FROM documents.csv
    
    
    	# pre-query, executed before the main fetch query
    	# multi-value, optional, default is empty list of queries
    	#
    	sql_query_pre			= SET NAMES utf8
    	# sql_query_pre			= SET SESSION query_cache_type=OFF
    
    	# main document fetch query
    	# mandatory, integer document ID field MUST be the first selected column
    	sql_query				= \
    		select id, number,tag, address from cn360
    
    	# range query setup, query that must return min and max ID values
    	# optional, default is empty
    	#
    	# sql_query will need to reference $start and $end boundaries
    	# if using ranged query:
    	#
    	# sql_query				= \
    	#	SELECT doc.id, doc.id AS group, doc.title, doc.data \
    	#	FROM documents doc \
    	#	WHERE id>=$start AND id<=$end
    	#
    	# sql_query_range		= SELECT MIN(id),MAX(id) FROM documents
    
    
    	# range query step
    	# optional, default is 1024
    	#
    	# sql_range_step		= 1000
    
    
    	# unsigned integer attribute declaration
    	# multi-value (an arbitrary number of attributes is allowed), optional
    	# optional bit size can be specified, default is 32
    	#
    	# sql_attr_uint			= author_id
    	# sql_attr_uint			= forum_id:9 # 9 bits for forum_id
    	#sql_attr_uint			= group_id
    
    	# boolean attribute declaration
    	# multi-value (an arbitrary number of attributes is allowed), optional
    	# equivalent to sql_attr_uint with 1-bit size
    	#
    	# sql_attr_bool			= is_deleted
    
    
    	# bigint attribute declaration
    	# multi-value (an arbitrary number of attributes is allowed), optional
    	# declares a signed (unlike uint!) 64-bit attribute
    	#
    	# sql_attr_bigint			= my_bigint_id
    
    
    	# UNIX timestamp attribute declaration
    	# multi-value (an arbitrary number of attributes is allowed), optional
    	# similar to integer, but can also be used in date functions
    	#
    	# sql_attr_timestamp	= posted_ts
    	# sql_attr_timestamp	= last_edited_ts
    	#sql_attr_timestamp		= date_added
    
    	# string ordinal attribute declaration
    	# multi-value (an arbitrary number of attributes is allowed), optional
    	# sorts strings (bytewise), and stores their indexes in the sorted list
    	# sorting by this attr is equivalent to sorting by the original strings
    	#
    	# sql_attr_str2ordinal	= author_name
    
    
    	# floating point attribute declaration
    	# multi-value (an arbitrary number of attributes is allowed), optional
    	# values are stored in single precision, 32-bit IEEE 754 format
    	#
    	# sql_attr_float = lat_radians
    	# sql_attr_float = long_radians
    
    
    	# multi-valued attribute (MVA) attribute declaration
    	# multi-value (an arbitrary number of attributes is allowed), optional
    	# MVA values are variable length lists of unsigned 32-bit integers
    	#
    	# syntax is ATTR-TYPE ATTR-NAME 'from' SOURCE-TYPE [;QUERY] [;RANGE-QUERY]
    	# ATTR-TYPE is 'uint' or 'timestamp'
    	# SOURCE-TYPE is 'field', 'query', or 'ranged-query'
    	# QUERY is SQL query used to fetch all ( docid, attrvalue ) pairs
    	# RANGE-QUERY is SQL query used to fetch min and max ID values, similar to 'sql_query_range'
    	#
    	# sql_attr_multi	= uint tag from query; SELECT id, tag FROM tags
    	# sql_attr_multi	= uint tag from ranged-query; \
    	#	SELECT id, tag FROM tags WHERE id>=$start AND id<=$end; \
    	#	SELECT MIN(id), MAX(id) FROM tags
    
    
    	# post-query, executed on sql_query completion
    	# optional, default is empty
    	#
    	# sql_query_post		=
    
    	
    	# post-index-query, executed on successful indexing completion
    	# optional, default is empty
    	# $maxid expands to max document ID actually fetched from DB
    	#
    	# sql_query_post_index = REPLACE INTO counters ( id, val ) \
    	#	VALUES ( 'max_indexed_id', $maxid )
    
    
    	# ranged query throttling, in milliseconds
    	# optional, default is 0 which means no delay
    	# enforces given delay before each query step
    	sql_ranged_throttle	= 0
    
    	# document info query, ONLY for CLI search (ie. testing and debugging)
    	# optional, default is empty
    	# must contain $id macro and must fetch the document by that id
    	sql_query_info		= SELECT * FROM cn360 WHERE id=$id
    
    	# kill-list query, fetches the document IDs for kill-list
    	# k-list will suppress matches from preceding indexes in the same query
    	# optional, default is empty
    	#
    	# sql_query_killlist	= SELECT id FROM documents WHERE edited>=@last_reindex
    
    
    	# columns to unpack on indexer side when indexing
    	# multi-value, optional, default is empty list
    	#
    	# unpack_zlib = zlib_column
    	# unpack_mysqlcompress = compressed_column
    	# unpack_mysqlcompress = compressed_column_2
    
    
    	# maximum unpacked length allowed in MySQL COMPRESS() unpacker
    	# optional, default is 16M
    	#
    	# unpack_mysqlcompress_maxsize = 16M
    
    
    	#####################################################################
    	## xmlpipe settings
    	#####################################################################
    
    	# type				= xmlpipe
    
    	# shell command to invoke xmlpipe stream producer
    	# mandatory
    	#
    	# xmlpipe_command	= cat /usr/local/coreseek/var/test.xml
    
    	#####################################################################
    	## xmlpipe2 settings
    	#####################################################################
    
    	# type				= xmlpipe2
    	# xmlpipe_command	= cat /usr/local/coreseek/var/test2.xml
    
    
    	# xmlpipe2 field declaration
    	# multi-value, optional, default is empty
    	#
    	# xmlpipe_field				= subject
    	# xmlpipe_field				= content
    
    
    	# xmlpipe2 attribute declaration
    	# multi-value, optional, default is empty
    	# all xmlpipe_attr_XXX options are fully similar to sql_attr_XXX
    	#
    	# xmlpipe_attr_timestamp	= published
    	# xmlpipe_attr_uint			= author_id
    
    
    	# perform UTF-8 validation, and filter out incorrect codes
    	# avoids XML parser choking on non-UTF-8 documents
    	# optional, default is 0
    	#
    	# xmlpipe_fixup_utf8		= 1
    }
    
        
    index cn360
    {
        # document source(s) to index
        # multi-value, mandatory
        # document IDs must be globally unique across all sources
        source			= cn360
    
        # index files path and file name, without extension
        # mandatory, path must be writable, extensions will be auto-appended
        path			= /usr/local/coreseek/var/data/cn360
    
        # document attribute values (docinfo) storage mode
        # optional, default is 'extern'
        # known values are 'none', 'extern' and 'inline'
        docinfo			= extern
    
        # memory locking for cached data (.spa and .spi), to prevent swapping
        # optional, default is 0 (do not mlock)
        # requires searchd to be run from root
        mlock			= 0
    
        # a list of morphology preprocessors to apply
        # optional, default is empty
        #
        # builtin preprocessors are 'none', 'stem_en', 'stem_ru', 'stem_enru',
        # 'soundex', and 'metaphone'; additional preprocessors available from
        # libstemmer are 'libstemmer_XXX', where XXX is algorithm code
        # (see libstemmer_c/libstemmer/modules.txt)
        #
        # morphology 	= stem_en, stem_ru, soundex
        # morphology	= libstemmer_german
        # morphology	= libstemmer_sv
        morphology		= none
    
        # minimum word length at which to enable stemming
        # optional, default is 1 (stem everything)
        #
        # min_stemming_len	= 1
    
    
        # stopword files list (space separated)
        # optional, default is empty
        # contents are plain text, charset_table and stemming are both applied
        #
        stopwords			= /data/stopwords.txt
        charset_dictpath = /usr/local/mmseg/etc/
        charset_type = zh_cn.utf-8
    
        # wordforms file, in "mapfrom > mapto" plain text format
        # optional, default is empty
        #
        wordforms			= /data/wordforms.txt
    
    
        # tokenizing exceptions file
        # optional, default is empty
        #
        # plain text, case sensitive, space insensitive in map-from part
        # one "Map Several Words => ToASingleOne" entry per line
        #
        exceptions		= /data/exceptions.txt
    
    
        # minimum indexed word length
        # default is 1 (index everything)
        min_word_len		= 1
    
        # charset encoding type
        # optional, default is 'sbcs'
        # known types are 'sbcs' (Single Byte CharSet) and 'utf-8'
    
    
        # charset definition and case folding rules "table"
        # optional, default value depends on charset_type
        #
        # defaults are configured to include English and Russian characters only
        # you need to change the table to include additional ones
        # this behavior MAY change in future versions
        #
        
    
    
        # ignored characters list
        # optional, default value is empty
        #
        # ignore_chars		= U+00AD
    
    
        # minimum word prefix length to index
        # optional, default is 0 (do not index prefixes)
        #
        # min_prefix_len	= 0
    
    
        # minimum word infix length to index
        # optional, default is 0 (do not index infixes)
        #
        # min_infix_len		= 0
    
    
        # list of fields to limit prefix/infix indexing to
        # optional, default value is empty (index all fields in prefix/infix mode)
        #
        # prefix_fields		= filename
        # infix_fields		= url, domain
    
    
        # enable star-syntax (wildcards) when searching prefix/infix indexes
        # known values are 0 and 1
        # optional, default is 0 (do not use wildcard syntax)
        #
        # enable_star		= 1
    
    
        # n-gram length to index, for CJK indexing
        # only supports 0 and 1 for now, other lengths to be implemented
        # optional, default is 0 (disable n-grams)
        #
        ngram_len				= 0
    
    
        # n-gram characters list, for CJK indexing
        # optional, default is empty
        #
        # ngram_chars			= U+3000..U+2FA1F
    
    
        # phrase boundary characters list
        # optional, default is empty
        #
        # phrase_boundary		= ., ?, !, U+2026 # horizontal ellipsis
    
    
        # phrase boundary word position increment
        # optional, default is 0
        #
        # phrase_boundary_step	= 100
    
    
        # whether to strip HTML tags from incoming documents
        # known values are 0 (do not strip) and 1 (do strip)
        # optional, default is 0
        html_strip				= 0
    
        # what HTML attributes to index if stripping HTML
        # optional, default is empty (do not index anything)
        #
        # html_index_attrs		= img=alt,title; a=title;
    
    
        # what HTML elements contents to strip
        # optional, default is empty (do not strip element contents)
        #
        # html_remove_elements	= style, script
    
    
        # whether to preopen index data files on startup
        # optional, default is 0 (do not preopen), searchd-only
        #
        # preopen					= 1
    
    
        # whether to keep dictionary (.spi) on disk, or cache it in RAM
        # optional, default is 0 (cache in RAM), searchd-only
        #
        # ondisk_dict				= 1
    
    
        # whether to enable in-place inversion (2x less disk, 90-95% speed)
        # optional, default is 0 (use separate temporary files), indexer-only
        #
        # inplace_enable			= 1
    
    
        # in-place fine-tuning options
        # optional, defaults are listed below
        #
        # inplace_hit_gap			= 0		# preallocated hitlist gap size
        # inplace_docinfo_gap		= 0		# preallocated docinfo gap size
        # inplace_reloc_factor	= 0.1	# relocation buffer size within arena
        # inplace_write_factor	= 0.1	# write buffer size within arena
    
    
        # whether to index original keywords along with stemmed versions
        # enables "=exactform" operator to work
        # optional, default is 0
        #
        # index_exact_words		= 1
    
    
        # position increment on overshort (less that min_word_len) words
        # optional, allowed values are 0 and 1, default is 1
        #
        # overshort_step			= 1
    
    
        # position increment on stopword
        # optional, allowed values are 0 and 1, default is 1
        #
        # stopword_step			= 1
    }
    
 # 索引数据 26 万
 ![search_coreseek_data.png]({{ site.url }}/assets/search/search_coreseek_data.png)
 
    cd /usr/local/coreseek
    bin/indexer -c etc/csft.conf --all
    
 # 测试,索引表数据26万,1ms时间
    bin/searchd &
    bin/search '网络'
    
    index 'cn360': query '网络 ': returned 79 matches of 79 total in 0.001 sec
    
    displaying matches:
    1. document=99, weight=1
    	id=99
    	number=05726032236
    	tag=洛可可网络销售有限公司
    	address=浙江 湖州市 长兴县台苑新村52-2-301
    2. document=386, weight=1
    	id=386
    	number=02165222611
    	tag=蓝柯网络科技有限公司
    	address=上海市虹口区四平路775弄天宝华庭1号楼1003室
    3. document=505, weight=1
    	id=505
    	number=076933385258
    
# mysql 查询
    
    select id from cn360 where tag like '%网络%' 
    花费448ms,coreseek 只需要1ms
    
 # php 
 
    <?php
    require ( "/wwwroot/coreseek/coreseek-3.2.14/csft-3.2.14/api/sphinxapi.php" );
    
    $cl = new SphinxClient ();
    
    $cl->SetServer ( '127.0.0.1', 9312);
    
    $cl->SetConnectTimeout ( 3 );
    
    $cl->SetArrayResult ( true );
    
    $cl->SetMatchMode ( SPH_MATCH_ANY);
    $index = 'cn360';
    $res = $cl->Query ( '网络搜索', $index );
    
    
    print_r($res);
    
    $matches = $res['matches'];
    print_r($matches);
    $matchId = array();
    foreach($matches as $match) {
    	$matchId[] = $match['id'];
    }
    print_r($matchId);
    // 拿到$matchId 列表去数据库再次检索

# 参考

* [CoreSeek Mysql 安装与测试 For Mac OS X（中文分词与中文全文检索）](http://www.lanecn.com/article/main/aid-67)
* [使用 Sphinx 更好地进行 MySQL 搜索](https://www.ibm.com/developerworks/cn/opensource/os-sphinx/index.html)
* [http://www.jianshu.com/p/5ddb834416c0](http://www.jianshu.com/p/5ddb834416c0)