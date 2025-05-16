import { useMenuStore } from '../../data/store'
import React, { useState } from 'react'

const SearchBar = () => {
    // state att hålla query
    const [searchQuery, setSearchQuery] = useState('')
    const setFilteredToys = useMenuStore(state => state.setFilteredToys) // Fixed typo in function name
    const toyList = useMenuStore(state => state.storeToysList)

    const handleSearch = (event) => { 
        const query = event.target.value.toLowerCase() // ser till att string är lowercase
        setSearchQuery(query)

        if (query.trim() === '') {
            // om query är tom visa hela toy listan
            setFilteredToys(toyList)
        }
        else {
            // filtera toys baserat på name, era och description
            const filteredToys = toyList.filter(toy =>
                toy.name?.toLowerCase().includes(query) ||
                toy.era?.toLowerCase().includes(query) ||
                toy.description?.toLowerCase().includes(query)
            )
            setFilteredToys(filteredToys)
        }
    }

    return (
        <div className="search-container">
            <input
                type="text"
                className="search-bar"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
            />
        </div>
    );
}

export default SearchBar