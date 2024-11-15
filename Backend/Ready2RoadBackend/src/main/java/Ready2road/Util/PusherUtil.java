package Ready2road.Util;

import com.google.gson.JsonObject;
import com.pusher.rest.Pusher;
import com.pusher.rest.data.Result;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class PusherUtil {
    private static PusherUtil instance = null;
    private final String APP_ID = "YOUR PUSHER APP ID";
    private final String APP_KEY="YOUR PUSHER APP KEY";
    private final String APP_SECRET="YOUR PUSHER APP SECRET";
    private Pusher pusher;
    private PusherUtil() {
        pusher = new Pusher(APP_ID, APP_KEY, APP_SECRET);
        pusher.setCluster("YOUR CLUSTER");
        pusher.setEncrypted(true);
    }
    public static PusherUtil getInstance() {
        if(instance == null)
            instance = new PusherUtil();
        return instance;
    }

    public void inviaEvento(String canale, String nomeEvento, Object data) {
        canale = canale.replace(" ", "");
        pusher.trigger(canale, nomeEvento, data);

    }

}
