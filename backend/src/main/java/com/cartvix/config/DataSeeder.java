package com.cartvix.config;

import com.cartvix.model.Product;
import com.cartvix.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;

        List<Product> products = List.of(
            Product.builder().title("Nike Air Max 270").category("Shoes").price(8999.0)
                .description("Iconic Nike Air Max cushioning for all-day comfort. Lightweight and stylish.")
                .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500").build(),

            Product.builder().title("Adidas Ultraboost 22").category("Shoes").price(12499.0)
                .description("Premium running shoes with Boost midsole for energy return.")
                .imageUrl("https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500").build(),

            Product.builder().title("Classic Oxford Shirt").category("Shirts").price(1799.0)
                .description("Premium cotton Oxford shirt. Perfect for office and casual wear.")
                .imageUrl("https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500").build(),

            Product.builder().title("Slim Fit Formal Shirt").category("Shirts").price(1299.0)
                .description("Modern slim-fit design with wrinkle-resistant fabric.")
                .imageUrl("https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=500").build(),

            Product.builder().title("Graphic Tee – Urban Vibes").category("T-Shirts").price(699.0)
                .description("100% cotton premium graphic tee. Relaxed fit for everyday comfort.")
                .imageUrl("https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500").build(),

            Product.builder().title("Plain Oversized T-Shirt").category("T-Shirts").price(499.0)
                .description("Trendy oversized fit in soft cotton. Available in multiple colors.")
                .imageUrl("https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500").build(),

            Product.builder().title("Snapback Cap – Black").category("Caps").price(599.0)
                .description("Structured snapback cap with embroidered logo. One size fits all.")
                .imageUrl("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500").build(),

            Product.builder().title("Aviator Sunglasses").category("Goggles").price(1499.0)
                .description("Classic aviator frames with UV400 polarized lenses.")
                .imageUrl("https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500").build(),

            Product.builder().title("Gold Chain Necklace").category("Jewellery").price(2999.0)
                .description("18K gold-plated chain necklace. Elegant and lightweight.")
                .imageUrl("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500").build(),

            Product.builder().title("Slim Fit Jeans – Indigo").category("Jeans").price(2199.0)
                .description("Premium stretch denim slim fit jeans. Comfortable all-day wear.")
                .imageUrl("https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500").build(),

            Product.builder().title("Cargo Pants – Olive Green").category("Pants").price(1899.0)
                .description("Tactical cargo pants with multiple pockets. Durable and stylish.")
                .imageUrl("https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500").build(),

            Product.builder().title("Floral Crop Top").category("Tops").price(799.0)
                .description("Trendy floral print crop top. Perfect for summer outings.")
                .imageUrl("https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500").build(),

            Product.builder().title("Summer Floral Frok").category("Froks").price(1599.0)
                .description("Lightweight floral print dress for summer. Flattering A-line cut.")
                .imageUrl("https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500").build(),

            Product.builder().title("Fossil Chronograph Watch").category("Watches").price(6999.0)
                .description("Premium chronograph watch with stainless steel bracelet.")
                .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500").build(),

            Product.builder().title("Leather Tote Bag").category("Bags").price(3499.0)
                .description("Genuine leather tote bag with spacious compartments.")
                .imageUrl("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500").build()
        );

        productRepository.saveAll(products);
        System.out.println("✅ Sample products seeded successfully!");
    }
}
