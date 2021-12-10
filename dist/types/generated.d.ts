export declare namespace streams {
    interface BaseEntry {
        [key: string]: any;
    }
    interface BaseStream {
        entries?: BaseEntry;
        [key: string]: any;
    }
    namespace cp_navigation {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            id?: string;
            svg?: string;
            icon?: string;
            image?: string;
            title?: string;
            parent?: string;
            dropdown?: any[];
            active?: boolean;
        }
    }
    namespace cp_shortcuts {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            id?: string;
            title?: string;
            icon?: string;
            svg?: string;
            dropdown?: any[];
        }
    }
    namespace cp_themes {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            id?: string;
            spacing?: number;
            radius?: number;
            light?: string;
            dark?: string;
            white?: string;
            black?: string;
            text?: string;
            buttons?: string;
            primary?: string;
            secondary?: string;
        }
    }
    namespace core_streams {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            id?: string;
            name?: string;
            description?: string;
            source?: any[];
            config?: any[];
            fields?: any[];
            ui?: any[];
            api?: any[];
        }
    }
    namespace core_applications {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            handle?: string;
            match?: any[];
            config?: any[];
        }
    }
    namespace clients {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            id?: number;
            name?: string;
            email?: string;
            age?: number;
            relative?: string;
            foo?: boolean;
        }
    }
    namespace foobars {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            id?: number;
            name?: string;
            email?: string;
            age?: number;
            options?: any[];
            links?: any[];
            menu?: any[];
        }
    }
    namespace people {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            name?: string;
            height?: number;
            mass?: number;
            hair_color?: string;
            skin_color?: string;
            eye_color?: string;
            birth_year?: string;
            gender?: string;
            homeworld?: string;
            films?: string;
            species?: string;
            vehicles?: string;
            starships?: string;
            created?: Date;
            edited?: Date;
        }
    }
    namespace planets {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            name?: string;
            rotation_period?: number;
            orbital_period?: number;
            diameter?: number;
            climate?: string;
            gravity?: string;
            terrain?: string;
            surface_water?: boolean;
            population?: number;
            residents?: string;
            films?: string;
            created?: Date;
            edited?: Date;
        }
    }
    namespace posts {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            id?: string;
            entry?: string;
            space?: string;
            title?: string;
            summary?: string;
            likes?: number;
            views?: number;
            shares?: number;
            privacy?: string;
        }
    }
    namespace profiles {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            role?: string;
            degrees?: any[];
            title?: string;
            specialty?: string;
            username?: string;
        }
    }
    namespace starships {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            name?: string;
            model?: string;
            manufacturer?: string;
            cost_in_credits?: number;
            length?: number;
            max_atmosphering_speed?: number;
            crew?: string;
            passengers?: number;
            cargo_capacity?: number;
            consumables?: string;
            hyperdrive_rating?: number;
            MGLT?: number;
            starship_class?: number;
            pilots?: string;
            films?: string;
            created?: Date;
            edited?: Date;
        }
    }
    namespace vehicles {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            name?: string;
            model?: string;
            manufacturer?: string;
            cost_in_credits?: number;
            length?: number;
            max_atmosphering_speed?: number;
            crew?: number;
            passengers?: number;
            cargo_capacity?: number;
            consumables?: string;
            vehicle_class?: string;
            pilots?: string;
            films?: string;
            created?: Date;
            edited?: Date;
        }
    }
    namespace cli_blueprints {
        interface Stream extends BaseStream {
            entries?: Entry;
        }
        interface Entry extends BaseEntry {
            template?: string;
            parent?: string;
        }
    }
    interface Entries {
        'cp.navigation': cp_navigation.Entry;
        'cp.shortcuts': cp_shortcuts.Entry;
        'cp.themes': cp_themes.Entry;
        'core.streams': core_streams.Entry;
        'core.applications': core_applications.Entry;
        'clients': clients.Entry;
        'foobars': foobars.Entry;
        'people': people.Entry;
        'planets': planets.Entry;
        'posts': posts.Entry;
        'profiles': profiles.Entry;
        'starships': starships.Entry;
        'vehicles': vehicles.Entry;
        'cli.blueprints': cli_blueprints.Entry;
        [key: string]: any;
    }
    interface Streams {
        'cp.navigation': cp_navigation.Stream;
        'cp.shortcuts': cp_shortcuts.Stream;
        'cp.themes': cp_themes.Stream;
        'core.streams': core_streams.Stream;
        'core.applications': core_applications.Stream;
        'clients': clients.Stream;
        'foobars': foobars.Stream;
        'people': people.Stream;
        'planets': planets.Stream;
        'posts': posts.Stream;
        'profiles': profiles.Stream;
        'starships': starships.Stream;
        'vehicles': vehicles.Stream;
        'cli.blueprints': cli_blueprints.Stream;
        [key: string]: any;
    }
    type StreamID = keyof Streams;
}
