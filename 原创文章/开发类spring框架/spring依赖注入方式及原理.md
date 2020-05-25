

# xml方式
## 构造函数

    <!--创建userDao对象-->
    <bean id="userDao" class="UserDao"/>

    <!--创建userService对象-->
    <bean id="userService" class="UserService">
        <!--要想在userService层中能够引用到userDao，就必须先创建userDao对象-->
        <constructor-arg index="0" name="userDao" type="UserDao" ref="userDao"></constructor-arg>
    </bean>

## set方法

    <!--
        1.创建userService，看到有userDao这个属性
        2.而userDao这个属性又是一个对象
        3.在property属性下又内置了一个bean
        4.创建userDao
    -->
    <bean id="userService" class="UserService">
        <property name="userDao">
            <bean id="userDao" class="UserDao"/>
        </property>
    </bean>
    <bean id="userDao" class="UserDao"/>

## 自动装配
1. 根据类型

        <bean id="userDao" class="UserDao"/>
        <!--
            1.通过类型来自动装配
            2.查找userService中所有带set方法的属性
            3.看看IOC容器中有没有和上一步类型相同的对象
            4.如果有，就装配进去
        -->
        <bean id="userService" class="UserService" autowire="byName"/>

2. 根据属性名称

        <bean id="userDao" class="UserDao"/>
        <!--
            1.通过名字来自动装配
            2.发现userService中有个叫userDao的属性
            3.看看IOC容器中没有叫userDao的对象
            4.如果有，就装配进去
        -->
        <bean id="userService" class="UserService" autowire="byName"/>

3. 根据构造函数 查找构造函数中类型相同的容器,注入

        <bean id="userDao"  class="com.zejian.spring.springIoc.dao.impl.UserDaoImpl" />
        <!-- constructor自动装配userDao-->
        <bean id="userService" autowire="constructor" class="com.zejian.spring.springIoc.service.impl.UserServiceImpl" />

# 注解
## @Autowired
不需要有set方法,按照自动装配的类型注入 只需要在xml中配置bean
## @Resource
不需要有set方法,按照自动装配的属性名称注入 只需要在xml中配置bean
## @Value
注入基本类型值

      @Value("${jdbc.url}")
      private String url;
      //SpEL表达方式，其中代表xml配置文件中的id值configProperties
      @Value("#{configProperties['jdbc.username']}")
      private String userName;


# 调用

    @Test
    public void testByXml() throws Exception {
        //加载配置文件
        ApplicationContext applicationContext=new ClassPathXmlApplicationContext("spring/spring-ioc.xml");

    //AccountService accountService=applicationContext.getBean("accountService",AccountService.class);
        //多次获取并不会创建多个accountService对象,因为spring默认创建是单实例的作用域
        AccountService accountService= (AccountService) applicationContext.getBean("accountService");
        accountService.doSomething();
    }
# 特性
1. 循环依赖抛出异常
2. 作用域分为signleton和prototype.(单例模式和每次new)






