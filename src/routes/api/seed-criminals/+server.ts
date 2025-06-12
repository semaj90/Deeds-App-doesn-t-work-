import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { criminals } from '$lib/server/db/schema';

export async function POST() {
    try {
        const dummyCriminals = [
            {
                firstName: 'John',
                lastName: 'Doe',
                dateOfBirth: new Date('1985-03-15'),
                address: '123 Main St, Anytown, USA',
                phone: '555-123-4567',
                email: 'john.doe@example.com'
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                dateOfBirth: new Date('1990-07-22'),
                address: '456 Oak Ave, Somewhere, USA',
                phone: '555-987-6543',
                email: 'jane.smith@example.com'
            },
            {
                firstName: 'Peter',
                lastName: 'Jones',
                dateOfBirth: new Date('1978-11-01'),
                address: '789 Pine Ln, Nowhere, USA',
                phone: '555-234-5678',
                email: 'peter.jones@example.com'
            },
            {
                firstName: 'Alice',
                lastName: 'Williams',
                dateOfBirth: new Date('1995-01-30'),
                address: '101 Elm St, Fictional City, USA',
                phone: '555-876-5432',
                email: 'alice.williams@example.com'
            },
            {
                firstName: 'Bob',
                lastName: 'Brown',
                dateOfBirth: new Date('1982-09-05'),
                address: '202 Birch Rd, Imaginary Town, USA',
                phone: '555-345-6789',
                email: 'bob.brown@example.com'
            },
            {
                firstName: 'Charlie',
                lastName: 'Davis',
                dateOfBirth: new Date('1970-04-10'),
                address: '303 Cedar Dr, Dreamland, USA',
                phone: '555-456-7890',
                email: 'charlie.davis@example.com'
            },
            {
                firstName: 'Diana',
                lastName: 'Miller',
                dateOfBirth: new Date('1988-12-25'),
                address: '404 Spruce Ct, Wonderland, USA',
                phone: '555-567-8901',
                email: 'diana.miller@example.com'
            },
            {
                firstName: 'Eve',
                lastName: 'Wilson',
                dateOfBirth: new Date('1992-06-18'),
                address: '505 Willow Way, Fantasyland, USA',
                phone: '555-678-9012',
                email: 'eve.wilson@example.com'
            },
            {
                firstName: 'Frank',
                lastName: 'Moore',
                dateOfBirth: new Date('1975-02-28'),
                address: '606 Poplar Pl, Utopia, USA',
                phone: '555-789-0123',
                email: 'frank.moore@example.com'
            },
            {
                firstName: 'Grace',
                lastName: 'Taylor',
                dateOfBirth: new Date('1998-10-03'),
                address: '707 Aspen Ct, Arcadia, USA',
                phone: '555-890-1234',
                email: 'grace.taylor@example.com'
            },
            {
                firstName: 'Henry',
                lastName: 'Anderson',
                dateOfBirth: new Date('1980-08-12'),
                address: '808 Redwood Rd, Elysium, USA',
                phone: '555-901-2345',
                email: 'henry.anderson@example.com'
            },
            {
                firstName: 'Ivy',
                lastName: 'Thomas',
                dateOfBirth: new Date('1993-05-07'),
                address: '909 Sequoia St, Xanadu, USA',
                phone: '555-012-3456',
                email: 'ivy.thomas@example.com'
            },
            {
                firstName: 'Jack',
                lastName: 'Jackson',
                dateOfBirth: new Date('1972-01-20'),
                address: '111 Palm Dr, Valhalla, USA',
                phone: '555-112-2334',
                email: 'jack.jackson@example.com'
            },
            {
                firstName: 'Karen',
                lastName: 'White',
                dateOfBirth: new Date('1987-09-11'),
                address: '222 Ocean Blvd, Atlantis, USA',
                phone: '555-223-3445',
                email: 'karen.white@example.com'
            },
            {
                firstName: 'Liam',
                lastName: 'Harris',
                dateOfBirth: new Date('1991-03-29'),
                address: '333 Desert Way, Shangri-La, USA',
                phone: '555-334-4556',
                email: 'liam.harris@example.com'
            },
            {
                firstName: 'Mia',
                lastName: 'Martin',
                dateOfBirth: new Date('1979-07-14'),
                address: '444 Mountain Pass, El Dorado, USA',
                phone: '555-445-5667',
                email: 'mia.martin@example.com'
            },
            {
                firstName: 'Noah',
                lastName: 'Garcia',
                dateOfBirth: new Date('1996-04-02'),
                address: '555 River Bend, Avalon, USA',
                phone: '555-556-6778',
                email: 'noah.garcia@example.com'
            },
            {
                firstName: 'Olivia',
                lastName: 'Rodriguez',
                dateOfBirth: new Date('1983-11-21'),
                address: '666 Lake Shore, Camelot, USA',
                phone: '555-667-7889',
                email: 'olivia.rodriguez@example.com'
            },
            {
                firstName: 'Paul',
                lastName: 'Martinez',
                dateOfBirth: new Date('1971-06-09'),
                address: '777 Forest Trail, Narnia, USA',
                phone: '555-778-8990',
                email: 'paul.martinez@example.com'
            },
            {
                firstName: 'Quinn',
                lastName: 'Hernandez',
                dateOfBirth: new Date('1994-08-08'),
                address: '888 Canyon Rd, Zion, USA',
                phone: '555-889-9001',
                email: 'quinn.hernandez@example.com'
            }
        ];

        await db.insert(criminals).values(dummyCriminals);
        return json({ message: 'Database seeded with example criminal data!' }, { status: 201 });
    } catch (error) {
        console.error('Error seeding database:', error);
        return json({ message: 'Failed to seed database' }, { status: 500 });
    }
}