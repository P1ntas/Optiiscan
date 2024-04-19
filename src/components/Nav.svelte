<script>
	import { Sidebar, SidebarWrapper, SidebarItem, SidebarGroup } from 'flowbite-svelte';
	import { UploadSolid, BookOpenSolid, RectangleListSolid } from 'flowbite-svelte-icons';

	export let page = '';

	//Applied to all sidebar items
	let spanClass =
		'flex-1 ms-3 whitespace-nowrap text-white flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 rounded-none';

	//Applied to all non-active sidebar items
	let nonActiveClass = 'hover:bg-[#191B3C] rounded-none';

	//Applied to the active sidebar item
	let activeClass = 'bg-[#B7352A] rounded-none hover:bg-[#B7352A]';
</script>

<aside class="sticky top-0 h-screen">
	<Sidebar asideClass="w-48">
		<SidebarWrapper divClass="overflow-y-auto py-4 bg-[#222451] h-screen">
			<SidebarGroup ulClass="">
				<img src="/logo.png" class="m-auto h-6 sm:h-16" alt="OptiiScan" />
				<hr class="my-7 h-px border-0 bg-white bg-opacity-30" />
				<SidebarItem
					href="/upload"
					label="Upload"
					{spanClass}
					active={page == 'upload'}
					class={page == 'upload' ? activeClass : nonActiveClass}
				>
					<svelte:fragment slot="icon">
						<UploadSolid
							class="ml-5 h-5 w-5 text-white transition duration-75 group-hover:text-gray-900"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					href="/logs"
					label="Logs"
					{spanClass}
					active={page == 'logs'}
					class={page == 'logs' ? activeClass : nonActiveClass}
				>
					<svelte:fragment slot="icon">
						<BookOpenSolid
							class="ml-5 h-5 w-5 text-white transition duration-75 group-hover:text-gray-900"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					href="/records"
					label="Records"
					{spanClass}
					active={page == 'records'}
					class={page == 'records' ? activeClass : nonActiveClass}
				>
					<svelte:fragment slot="icon">
						<RectangleListSolid
							class="ml-5 h-5 w-5 text-white transition duration-75 group-hover:text-gray-900 "
						/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</aside>

<style>
</style>
