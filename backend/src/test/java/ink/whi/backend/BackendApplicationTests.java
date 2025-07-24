package ink.whi.backend;

import com.fasterxml.jackson.core.JsonParser;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import ink.whi.backend.common.utils.JsonUtil;
import ink.whi.backend.common.utils.UserPwdEncoderUtil;
import lombok.Data;
import org.hibernate.validator.internal.util.stereotypes.Immutable;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

//@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
        String pwd = UserPwdEncoderUtil.encoder("123456");
        System.out.println(pwd);
    }

    @Test
    void test1() {
        Object o1 = true ? Integer.valueOf(1) : Double.valueOf(2.0);
        Object o2 = Integer.valueOf(1);
        System.out.println(o1);
        System.out.println(o2);
    }

    @Test
    void test2() {
        @Data
        class User{
            String name;

            public User(String name) {
                this.name = name;
            }
        }

        List<Integer> list = Lists.newArrayList(1, 2, 3);
        List<Integer> list1 = Collections.unmodifiableList(list);
        ImmutableList<Integer> list2 = ImmutableList.copyOf(list);

        list.add(4);
        System.out.println(list1);
        System.out.println(list2);

        list.set(0, 5);
        System.out.println(list1);
        System.out.println(list2);

        List<User> l = Lists.newArrayList(new User("hjj"));
        List<User> l1 = Collections.unmodifiableList(l);
        ImmutableList<User> l2 = ImmutableList.copyOf(l);

        l.add(0, new User("hjj"));
    }

    @Test
    void test3() {
        @Data
        class User{
            String name;

            public User(String name) {
                this.name = name;
            }
        }

        Map<User, String> map = Maps.newHashMap();
        User user = new User("hjj");
        map.put(user, "test");
        System.out.println(map);
        System.out.println(map.get(user));

        user.name = "abc";
        System.out.println(map);
        System.out.println(map.get(user));
    }

}
