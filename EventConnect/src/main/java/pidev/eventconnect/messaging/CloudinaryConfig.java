package pidev.eventconnect.messaging;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;



@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "ddbunaglw",
                "api_key", "915436136837845",
                "api_secret", "FMD_RxeZiE1NMUCeMWz5XcVizDw"
        ));
    }
}