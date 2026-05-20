package com.petstore.config;

import com.petstore.entity.Category;
import com.petstore.entity.HealthStatus;
import com.petstore.entity.HealthStatusEnum;
import com.petstore.entity.Pet;
import com.petstore.entity.PetPhoto;
import com.petstore.repository.CategoryRepository;
import com.petstore.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SampleDataSeeder implements ApplicationRunner {

    private final CategoryRepository categoryRepository;
    private final PetRepository petRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (petRepository.count() > 0) {
            return;
        }

        log.info("Seeding sample petstore data");

        Category dogs = ensureCategory("Dogs", "Dog");
        Category cats = ensureCategory("Cats", "Cat");
        Category birds = ensureCategory("Birds", "Bird");
        Category rabbits = ensureCategory("Rabbits", "Rabbit");
        Category hamsters = ensureCategory("Hamsters", "Hamster");

        petRepository.saveAll(List.of(
                createPet(
                        "Max",
                        "Dog",
                        "Golden Retriever",
                        4,
                        "A friendly golden retriever who loves to play fetch",
                        dogs,
                        HealthStatusEnum.HEALTHY,
                        "https://images.unsplash.com/photo-1633722715463-d30628cbe0d3?w=400",
                        "https://images.unsplash.com/photo-1612536315918-b36e1d6c9e7a?w=400"
                ),
                createPet(
                        "Bella",
                        "Dog",
                        "German Shepherd",
                        3,
                        "A gentle German Shepherd with a protective nature",
                        dogs,
                        HealthStatusEnum.VACCINATION_PENDING,
                        "https://images.unsplash.com/photo-1568572933382-74d440642117?w=400"
                ),
                createPet(
                        "Charlie",
                        "Dog",
                        "Border Collie",
                        2,
                        "An energetic border collie who loves herding",
                        dogs,
                        HealthStatusEnum.HEALTHY,
                        "https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400"
                ),
                createPet(
                        "Whiskers",
                        "Cat",
                        "Persian",
                        5,
                        "A fluffy Persian cat with a calm demeanor",
                        cats,
                        HealthStatusEnum.HEALTHY,
                        "https://images.unsplash.com/photo-1514888286974-6c03bf1a4f8c?w=400",
                        "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400"
                ),
                createPet(
                        "Luna",
                        "Cat",
                        "Siamese",
                        3,
                        "A sleek Siamese cat who loves attention",
                        cats,
                        HealthStatusEnum.UNDER_VETERINARY_CARE,
                        "https://images.unsplash.com/photo-1518894917744-12107fb5c385?w=400"
                ),
                createPet(
                        "Shadow",
                        "Cat",
                        "Domestic Shorthair",
                        4,
                        "A mysterious black cat who enjoys quiet time",
                        cats,
                        HealthStatusEnum.HEALTHY,
                        "https://images.unsplash.com/photo-1542652694d5-142483146814?w=400"
                ),
                createPet(
                        "Tweety",
                        "Bird",
                        "Macaw",
                        1,
                        "A colorful macaw who can mimic sounds",
                        birds,
                        HealthStatusEnum.HEALTHY,
                        "https://images.unsplash.com/photo-1544923408-75c3bae17b3f?w=400"
                ),
                createPet(
                        "Polly",
                        "Bird",
                        "Parakeet",
                        2,
                        "A blue parakeet with a melodious chirp",
                        birds,
                        HealthStatusEnum.HEALTHY,
                        "https://images.unsplash.com/photo-1444464666175-1b9a92f2f841?w=400"
                ),
                createPet(
                        "Hopper",
                        "Rabbit",
                        "Lionhead Rabbit",
                        2,
                        "A fluffy white rabbit with long ears",
                        rabbits,
                        HealthStatusEnum.VACCINATION_PENDING,
                        "https://images.unsplash.com/photo-1585110396000-c9fbe2d08c54?w=400"
                ),
                createPet(
                        "Flopsy",
                        "Rabbit",
                        "Netherland Dwarf",
                        1,
                        "A brown rabbit who loves to hop around",
                        rabbits,
                        HealthStatusEnum.HEALTHY,
                        "https://images.unsplash.com/photo-1585110396000-c9fbe2d08c54?w=400"
                ),
                createPet(
                        "Squeak",
                        "Hamster",
                        "Syrian Hamster",
                        1,
                        "A golden hamster with an active personality",
                        hamsters,
                        HealthStatusEnum.HEALTHY,
                        "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400"
                ),
                createPet(
                        "Nibbles",
                        "Hamster",
                        "Dwarf Hamster",
                        1,
                        "A cute dwarf hamster who loves sunflower seeds",
                        hamsters,
                        HealthStatusEnum.HEALTHY,
                        "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400"
                )
        ));
    }

    private Category ensureCategory(String name, String speciesType) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(name)
                        .speciesType(speciesType)
                        .build()));
    }

    private Pet createPet(
            String name,
            String species,
            String breed,
            Integer age,
            String bio,
            Category category,
            HealthStatusEnum healthStatus,
            String... photoUrls) {

        Pet pet = Pet.builder()
                .name(name)
                .species(species)
                .breed(breed)
                .age(age)
                .bio(bio)
                .category(category)
                .build();

        List<PetPhoto> photos = java.util.stream.IntStream.range(0, photoUrls.length)
                .mapToObj(index -> PetPhoto.builder()
                        .pet(pet)
                        .photoUrl(photoUrls[index])
                        .displayOrder(index)
                        .build())
                .toList();

        List<HealthStatus> healthStatuses = List.of(HealthStatus.builder()
                .pet(pet)
                .status(healthStatus)
                .build());

        pet.setPhotos(photos);
        pet.setHealthStatuses(healthStatuses);

        return pet;
    }
}