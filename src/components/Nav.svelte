<script>
	import { Sidebar, SidebarWrapper, SidebarItem, SidebarGroup } from 'flowbite-svelte';
	import { UploadSolid, BookOpenSolid, RectangleListSolid } from 'flowbite-svelte-icons';

	let spanClass = 'flex-1 ms-3 whitespace-nowrap text-white';
	let nonActiveClass =
		'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-[#B7352A] dark:hover:bg-[#B7352A]';
</script>

<Sidebar asideClass="w-48">
	<SidebarWrapper
		divClass="overflow-y-auto py-4 px-3 bg-[#222451] rounded dark:bg-gray-800 h-screen"
	>
		<SidebarGroup ulClass="">
			<img src="/logo.png" class="m-auto h-6 sm:h-16" alt="OptiiScan" />
			<hr class="my-6 h-px border-0 bg-gray-700 dark:bg-gray-700" />
			<SidebarItem label="Upload" {spanClass} {nonActiveClass}>
				<svelte:fragment slot="icon">
					<UploadSolid
						class="h-5 w-5 text-white transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem label="Logs" {spanClass} {nonActiveClass}>
				<svelte:fragment slot="icon">
					<BookOpenSolid
						class="h-5 w-5 text-white transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem label="Records" {spanClass} {nonActiveClass}>
				<svelte:fragment slot="icon">
					<RectangleListSolid
						class="h-5 w-5 text-white transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
