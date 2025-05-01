#[allow(unused_use)]

module Figo_NFT::Figo_NFT {
    use std::vector;
    use std::option::{Self, Option};
    use std::string::{Self, String};
    use iota::url::{Self, Url};
    use iota::table::{Self, Table};
    use iota::transfer;
    use iota::tx_context;
    use iota::event;
    use iota::dynamic_field;
    use iota::borrow;
    use iota::object;
    use iota::package;
    use iota::display;

    //=================== ERROR CODES ===================//

    /// Component slot is already occupied
    const ESLOT_OCCUPIED: u64 = 1;
    /// Component slot is empty
    const ESLOT_EMPTY: u64 = 2;
    /// Caller is not the owner of the NFT
    const ENOT_OWNER: u64 = 3;

    //=================== STRUCTURES ===================//

    /// One-Time-Witness for the module.
    public struct FIGO_NFT has drop {}
    
    /// Represents a collection of NFTs
    public struct Collection has key, store {
        id: UID,
        standard: String,
        name: String,
        description: String,
        url: Url,
        creator: address,
    }

    /// Parent NFT that can have components equipped
    public struct ParentNFT has key, store {
        id: UID,
        collection_id: ID,
        name: String,
        description: String,
        image_url: Url,
        equipped_components: Table<String, ID>,

    }

    /// Component NFT that can be equipped to a parent
    public struct ComponentNFT has key, store {
        id: UID,
        collection_id: ID,
        name: String,
        description: String,
        image_url: Url,
        component_type: String, // e.g., "weapon", "boots", "helmet"
    }

    //=================== EVENTS ===================//
    
    /// Emitted when a new collection is created
    public struct CollectionCreatedEvent has copy, drop {
        collection_id: ID,
        creator: address,
        name: String
    }

    /// Emitted when a parent NFT is minted
    public struct ParentNFTMintedEvent has copy, drop {
        owner: address,
        nft_id: ID,
        name: String
    }

    /// Emitted when a component NFT is minted
    public struct ComponentNFTMintedEvent has copy, drop {
        owner: address,
        component_id: ID,
        name: String,
        component_type: String
    }

    /// Emitted when a component is equipped to a parent NFT
    public struct ComponentEquippedEvent has copy, drop {
        parent_id: ID,
        component_id: ID,
        component_type: String
    }

    /// Emitted when a component is unequipped from a parent NFT
    public struct ComponentUnequippedEvent has copy, drop {
        parent_id: ID,
        component_id: ID,
        component_type: String
    }

    /// Emitted when an NFT is transferred
    public struct NFTTransferredEvent has copy, drop {
        from: address,
        to: address,
        nft_type: String, // "parent" or "component"
        id: ID
    }

    //=================== MODULE INITIALIZATION ===================//
    
    /// Initializes the module state
    fun init(otw: FIGO_NFT, ctx: &mut TxContext) {
        let publisher = package::claim(otw,ctx);

        let mut parent_keys = 0x1::vector::empty<0x1::string::String>();
        0x1::vector::push_back(&mut parent_keys, 0x1::string::utf8(b"name"));
        0x1::vector::push_back(&mut parent_keys, 0x1::string::utf8(b"thumbnail_url"));
        0x1::vector::push_back(&mut parent_keys, 0x1::string::utf8(b"image_url"));
        0x1::vector::push_back(&mut parent_keys, 0x1::string::utf8(b"description"));
        0x1::vector::push_back(&mut parent_keys, 0x1::string::utf8(b"collection_id"));

        let mut parent_values = 0x1::vector::empty<0x1::string::String>();
        0x1::vector::push_back(&mut parent_values, 0x1::string::utf8(b"{name}"));
        0x1::vector::push_back(&mut parent_values, 0x1::string::utf8(b"{image_url}"));
        0x1::vector::push_back(&mut parent_values, 0x1::string::utf8(b"{image_url}"));
        0x1::vector::push_back(&mut parent_values, 0x1::string::utf8(b"{description}"));
        0x1::vector::push_back(&mut parent_values, 0x1::string::utf8(b"{collection_id}"));

        let mut displayParent = display::new_with_fields<ParentNFT>(
            &publisher, parent_keys, parent_values, ctx
        );

        // Commit first version of `Display` to apply changes.
        display::update_version<ParentNFT>(&mut displayParent);

        let mut component_keys = 0x1::vector::empty<0x1::string::String>();
        0x1::vector::push_back(&mut component_keys, 0x1::string::utf8(b"name"));
        0x1::vector::push_back(&mut component_keys, 0x1::string::utf8(b"thumbnail_url"));
        0x1::vector::push_back(&mut component_keys, 0x1::string::utf8(b"image_url"));
        0x1::vector::push_back(&mut component_keys, 0x1::string::utf8(b"description"));
        0x1::vector::push_back(&mut component_keys, 0x1::string::utf8(b"collection_id"));
        0x1::vector::push_back(&mut component_keys, 0x1::string::utf8(b"component_type"));

        let mut component_values = 0x1::vector::empty<0x1::string::String>();
        0x1::vector::push_back(&mut component_values, 0x1::string::utf8(b"{name}"));
        0x1::vector::push_back(&mut component_values, 0x1::string::utf8(b"{image_url}"));
        0x1::vector::push_back(&mut component_values, 0x1::string::utf8(b"{image_url}"));
        0x1::vector::push_back(&mut component_values, 0x1::string::utf8(b"{description}"));
        0x1::vector::push_back(&mut component_values, 0x1::string::utf8(b"{collection_id}"));
        0x1::vector::push_back(&mut component_values, 0x1::string::utf8(b"{component_type}"));

        let mut displayComponent = display::new_with_fields<ComponentNFT>(
            &publisher, component_keys, component_values, ctx
        );

        display::update_version<ComponentNFT>(&mut displayComponent);
        package::burn_publisher(publisher);

        transfer::public_transfer(displayParent, tx_context::sender(ctx));
        transfer::public_transfer(displayComponent, tx_context::sender(ctx));

    }

    //=================== Create Collection ==================//

    public entry fun create_collection(name: vector<u8>, description: vector<u8>, url: vector<u8>, ctx: &mut TxContext) {
        let creator_addr = tx_context::sender(ctx);
        
        // Create the collection with separate supply counters
        let collection = Collection {
            id: object::new(ctx),
            standard: string::utf8(b"IRC27"),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            creator: creator_addr,
        };

        event::emit(CollectionCreatedEvent {collection_id: object::id(&collection), creator: creator_addr, name: collection.name});

        transfer::share_object<Collection>(collection);
    }

    //=================== NFT FUNCTIONS ===================//
    
    public entry fun mint_parent_nft(
        collection: &Collection,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
       
        let sender = tx_context::sender(ctx);

        // Create the NFT with IOTA table for equipped components
        let nft = ParentNFT {
            id: object::new(ctx),
            collection_id: object::id(collection),
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: url::new_unsafe_from_bytes(url),
            equipped_components: table::new(ctx),
        };
        
        event::emit(ParentNFTMintedEvent {owner: sender, nft_id: object::id(&nft), name: nft.name});

        // Store the NFT to the recipient
        transfer::public_transfer(nft, sender);
    }
    
    public entry fun mint_component_nft(
        collection: &Collection,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        component_type: vector<u8>,
        ctx: &mut TxContext
    ) { 
        let sender = tx_context::sender(ctx);

        // Create the component NFT
        let component = ComponentNFT {
            id: object::new(ctx),
            collection_id: object::id(collection),
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: url::new_unsafe_from_bytes(url),
            component_type: string::utf8(component_type),
        };
        
        event::emit(ComponentNFTMintedEvent {owner: sender, component_id: object::id(&component), name: component.name, component_type: component.component_type});
        
        // Store the NFT to the recipient
        transfer::public_transfer(component, sender);
        
    }

    //=================== EQUIPMENT FUNCTIONS ===================//
    
    public entry fun equip_component(
        parent_nft: &mut ParentNFT,
        component_nft: ComponentNFT,
        ctx: &mut TxContext
    ) {
        
        // Get references to the NFTs
        let component_type = component_nft.component_type;
        
        // Check if a component of this type is haven't equipped
        assert!(!table::contains(&parent_nft.equipped_components, component_type), ESLOT_OCCUPIED);
        // Equip the new component
        table::add(&mut parent_nft.equipped_components, component_type, object::id(&component_nft));
        
        event::emit(ComponentEquippedEvent {parent_id: object::id(parent_nft), component_id: object::id(&component_nft), component_type });
        
        transfer::public_transfer(component_nft, tx_context::sender(ctx));
        
    }
    
    public entry fun unequip_component(
        parent_nft: &mut ParentNFT,
        component_nft: ComponentNFT,
        ctx: &mut TxContext
    ) {

        let sender = tx_context::sender(ctx);

        let component_type = component_nft.component_type;

        // Check if a component of this type is already equipped
        assert!(table::contains(&parent_nft.equipped_components, component_type), ESLOT_EMPTY);
        // Remove the component
        table::remove(&mut parent_nft.equipped_components, component_type);

        event::emit(ComponentUnequippedEvent {parent_id: object::id(parent_nft), component_id: object::id(&component_nft), component_type: component_type});

        transfer::public_transfer(component_nft, sender);
        

    }

    //=================== OWNERSHIP TRANSFER FUNCTIONS ===================//
    
    public entry fun transfer_parent_nft(
        parent_nft: ParentNFT,
        new_owner_addr: address,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        event::emit(NFTTransferredEvent{
        from: sender,
        to: new_owner_addr,
        nft_type: string::utf8(b"Parent"),
        id: object::id(&parent_nft),
    });

        transfer::public_transfer(parent_nft, new_owner_addr);
        
    }
    
    public entry fun transfer_component_nft(
        parent_nft: &mut ParentNFT,
        component_nft: ComponentNFT,
        new_owner_addr: address,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        let component_type = component_nft.component_type;

        // Check if a component of this type is already equipped
        assert!(table::contains(&parent_nft.equipped_components, component_type), ESLOT_EMPTY);
        // Remove the component
        table::remove(&mut parent_nft.equipped_components, component_type);
            
        event::emit(NFTTransferredEvent{
        from: sender,
        to: new_owner_addr,
        nft_type: string::utf8(b"Component"),
        id: object::id(&component_nft)
    });

        transfer::public_transfer(component_nft, new_owner_addr);
        
    }

    //=================== VIEW FUNCTIONS ===================//
    
    public fun is_component_equipped(parent_nft: &ParentNFT, component_type: vector<u8>): bool {
    table::contains(&parent_nft.equipped_components, string::utf8(component_type))
    }
    
    public fun get_equipped_component_id(parent_nft: &ParentNFT, component_type: vector<u8>): Option<ID> {
    let type_str = string::utf8(component_type);
    if (table::contains(&parent_nft.equipped_components, type_str)) {
        return option::some(*table::borrow(&parent_nft.equipped_components, type_str))
    };
    
    option::none()
    }
    
}   